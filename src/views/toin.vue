<template>
    <v-card>
        <v-card-title>
            <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      
      <v-data-table
        :headers="headers"
        :items="editoras"
        :search="search"
        sort-by="id"
        class="elevation-1"
         :pagination.sync="pagination"
        :items-per-page="5"
      >
        <template v-slot:top>
          <v-toolbar
            flat
          >
            <v-toolbar-title><h2>Editoras</h2></v-toolbar-title>
            <v-spacer></v-spacer>
            <v-dialog
              v-model="dialog"
              max-width="500px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  Adicionar Editora
                </v-btn>
              </template>
              <v-form ref="editoraForm" @submit.prevent="save">
                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>
      
                  <v-card-text>
                    <v-container>
                      <v-text-field label="Nome"
                        :rules="rules"
                        hide-details="auto"
                        required
                        v-model="editora.nome"
                        prepend-icon="mdi-account"
                      ></v-text-field>
                      <v-text-field label="Cidade"
                        :rules="rules"
                        hide-details="auto"
                        required
                        v-model="editora.cidade"
                        prepend-icon="mdi-city"
                      ></v-text-field>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="error"
                      @click="close"
                    >
                      Fechar
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="addEditora"
                    >
                      Feito
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-form>
            </v-dialog>
          </v-toolbar>
        </template>
        <template slot="item.actions" slot-scope="{ item }">
          <v-btn
            small
            class="mr-2 primary"
            @click="editItem(item)"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn class="error"
            small
            @click="deleteItem(item)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
        <template v-slot:no-data>
        </template>
      </v-data-table>
    </v-card>
  </template>
  
  <script>
  import Swal from 'sweetalert2';
  import Publisher from '../services/editora';
  
  export default {
    data: () => ({
      search: '',
      pagination: {
        rowsPerPage: 5, 
        },
      formIsValid: false,
      rules: [
        value => !!value || 'Campo Obrigatório',
        value => (value && value.length >= 3) || 'Minimo 3 caracteres',
      ],
      dialog: false,
      dialogDelete: false,
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Nome', value: 'nome' },
        { text: 'Cidade', value: 'cidade' },
        { text: 'Ações', value: 'actions', sortable: false },
      ],
      editora: {
        id: '',
        nome: '',
        cidade: ''
      },
       nomeTouched: false,
       cidadeTouched: false,
      
      editoras: [],
      errors: [],
      editedIndex: -1,
      editedItem: {
        nome: '',
        cidade: '',
      },
      defaultItem: {
        nome: '',
        cidade: '',
      },
    }),
  
    mounted() {
      this.list();
    },
  
    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'Adicionar Editora' : 'Editar Editora';
      },
    },
  
    watch: {
      dialog(val) {
        val || this.close();
      },
      dialogDelete(val) {
        val || this.closeDelete();
      },
    },
  
    methods: {
      checkFormValidity() {
        this.formIsValid = this.$refs.editoraForm.validate();
      },
  
      list() {
        Publisher.list()
          .then(response => {
            const orderPublisher = response.data.sort((a, b) => a.id - b.id);
            this.editoras = orderPublisher;
          });
      },
  
      editItem(item) {
        this.editora.id = item.id;
        this.editora.nome = item.nome;
        this.editora.cidade = item.cidade;
        this.editedIndex = this.editoras.indexOf(item);
        this.dialog = true;
        this.checkFormValidity();
      },
  
      deleteItem(editora) {
        Swal.fire({
          icon: 'warning',
          title: 'Deseja excluir o produto?',
          text: 'Essa ação não pode ser Desfeita!',
          showCancelButton: true,
          confirmButtonText: 'Sim',
          cancelButtonText: 'Não',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
        }).then((result) => {
          if (result.isConfirmed) {
            Publisher.delete(editora).then(() => {
              Swal.fire({
                icon: 'success',
                title: 'Editora Excluida com Sucesso!',
                showConfirmButton: false,
                timer: 1000,
              });
  
              this.list();
            });
          }
        });
      },
  
      deleteItemConfirm() {
        this.desserts.splice(this.editedIndex, 1);
        this.closeDelete();
      },
  
          close() {
              this.dialog = false;
              this.editora.id = '';
              this.editora.nome = '';
              this.editora.cidade = '';
              this.editedIndex = -1;
              this.nomeTouched = false;
              this.cidadeTouched = false;
              this.$refs.editoraForm.reset()
          },
  
      closeDelete() {
        this.dialogDelete = false;
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        });
      },
  
      save() {
        if (!this.editora.id) {
          Publisher.save(this.editora)
            .then(() => {
              Swal.fire({
                icon: 'success',
                title: 'Editora cadastrada com Sucesso!',
                showConfirmButton: false,
                timer: 2000,
              });
  
              this.close();
              this.list();
                this.$refs.editoraForm.reset()
            });
        } else {
          Publisher.update(this.editora)
            .then(() => {
              this.editora = {};
              Swal.fire({
                icon: 'success',
                title: 'Editora Atualizada com Sucesso!',
                showConfirmButton: false,
                timer: 2000,
              });
              this.list();
              this.close();
                this.$refs.editoraForm.reset()
            });
        }
      },
        addEditora() {
      this.checkFormValidity(); 
      if (this.formIsValid) {
        this.save();
      }
    },
    },
  };
  </script>
  
  <style scoped>
  
  </style>
  