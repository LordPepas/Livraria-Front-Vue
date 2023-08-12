<template>
  <div class="py-6 table d-flex justify-center">
    <v-data-table
      class="px-8 py-8 dataTable"
      :loading="isLoading"
      loading-text="Carregando dados... Por favor espere!"
      :headers="headers"
      :items="publishers"
      :search="search"
      :items-per-page="5"
      :sort-by="['id']"
      :footer-props="{
        itemsPerPageOptions: [5, 10, 25, 50],
        itemsPerPageText:'Linhas por página'
      }"
      update:sort-by
      multi-sort
    >
      <template v-slot:top>
        <v-toolbar-title v-if="$vuetify.breakpoint.xs" class="font-weight-medium text-h4 text-center mb-4"
          >Editoras</v-toolbar-title>
        <v-toolbar flat class="mb-5">
          <v-toolbar-title class="font-weight-medium text-h4"
            >Editoras</v-toolbar-title
          >
          <v-divider v-if="!$vuetify.breakpoint.xs" class="mx-6" light vertical></v-divider>

          <v-dialog v-model="dialog" persistent max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                dark
                color="c500"
                class="rounded-lg px-0"
                min-width="40"
                height="40"
                v-bind="attrs"
                v-on="on"
              >
                <PhPlus size="30" weight="bold" />
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-form
                    class="px-1"
                    ref="form"
                    v-model="valid"
                    lazy-validation
                  >
                    <v-row>
                      <v-col cols="12" class="pb-0">
                        <v-text-field
                          v-model.trim="editedItem.name"
                          label="Nome da editora"
                          append-icon="mdi-bookshelf"
                          counter="25"
                          :rules="[
                            rules.required,
                            rules.maxLength,
                            rules.minLength,
                            rules.notEmpty,
                            rules.onlyWords,
                          ]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" class="pb-0">
                        <v-text-field
                          v-model.trim="editedItem.city"
                          label="Cidade da editora"
                          append-icon="mdi-city-variant-outline"
                          counter="20"
                          :rules="[
                            rules.required,
                            rules.maxCityLength,
                            rules.minLength,
                            rules.notEmpty,
                            rules.onlyWords,
                          ]"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" text @click="close"> Cancelar </v-btn>
                <v-btn color="primary" text @click="save" :disabled="!valid">
                  Salvar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-spacer></v-spacer>
          <v-col class="d-flex" cols="12" md="5" sm="5" xs="3">
            <v-text-field
              class="searchInput"
              hide-details
              v-model="search"
              label="Pesquisar"
              color="c500"
              append-icon="mdi-magnify"
              clearable
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-toolbar>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip top color="c800">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              outlined
              color="c800"
              class="tableBtn blueBtn rounded-md px-0 mr-2"
              min-width="30"
              height="30"
              v-bind="attrs"
              v-on="on"
              @click="editItem(item)"
            >
              <PhNotePencil size="25" weight="bold" />
            </v-btn>
          </template>
          <span>Editar</span>
        </v-tooltip>
        <v-tooltip top color="c900">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              outlined
              color="c900"
              class="tableBtn redBtn rounded-md px-0"
              min-width="30"
              height="30"
              v-bind="attrs"
              v-on="on"
              @click="deleteItem(item)"
            >
              <PhTrash size="25" weight="bold" />
            </v-btn>
          </template>
          <span>Deletar</span>
        </v-tooltip>
      </template>
      <template v-slot:no-data>
        <h3>Tabela vazia...</h3>
      </template>
      <template v-slot:no-results>
        <span>Nenhum registro encontrado!</span>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { PhPlus, PhNotePecnil, PhTrash } from 'phosphor-vue';
import publisherAccess from '@/services/publisherAccess';

export default {
  name: 'PublisherView',
  components: {
    PhPlus,
    PhNotePencil,
    PhTrash,
  },
  data: () => ({
    search: '',
    isLoading: true,
    dialog: false,
    valid: true,
    headers: [
      { text: 'ID', align: 'start', value: 'id' },
      { text: 'Nome', value: 'name' },
      { text: 'Cidade', value: 'city' },
      { text: 'Ações', value: 'actions', sortable: false, align: 'center' },
    ],
    publishers: [],
    editedIndex: -1,
    editedItem: {
      id: 0,
      name: '',
      city: '',
    },
    defaultItem: {
      id: 0,
      name: '',
      city: '',
    },
    rules: {
      required: (value) => !!value || 'Este campo é obrigatório.',
      maxLength: (value) => value.length <= 45 || 'Máximo de 45 caracteres.',
      maxCityLength: (value) =>
        value.length <= 30 || 'Máximo de 30 caracteres.',
      minLength: (value) => value.length >= 3 || 'Mínimo de 3 caracteres.',
      notEmpty: (value) => !/[ ]+$/.test(value) || 'Inválido.',
      onlyWords: (value) =>
        !/[^a-zA-ZÀ-ú'` ]+/.test(value) || 'Caracteres inválidos detectados.',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nova editora' : 'Editar editora';
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
      val || this.$refs.form.resetValidation();
    },
  },

  created() {
    this.fetchApi();
  },

  methods: {
    async fetchApi() {
      await publisherAccess.getAll().then((res) => {
        this.publishers = res.data.content;
        this.isLoading = false;
      });
    },

    editItem(item) {
      this.editedIndex = item.id;
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = item.id;
      this.editedItem = Object.assign({}, item);
      this.deleteItemConfirm();
    },

    deleteItemConfirm() {
      this.$swal({
        title: 'Você deseja deletar esse registro?',
        icon: 'warning',
        showDenyButton: true,
        confirmButtonText: 'Deletar',
        denyButtonText: 'Cancelar',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.delete();
        } else if (result.isDenied) {
          this.$swal({
            title: 'Deleção interrompida!',
            icon: 'info',
            allowOutsideClick: false,
          });
        }
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
          this.$refs.form.resetValidation()
        });
      });
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      if (!this.$refs.form.validate()) return;
      if (this.editedIndex > -1) {
        this.update();
      } else {
        this.insert();
      }
      this.close();
    },

    async insert() {
      await publisherAccess
        .post(this.editedItem)
        .then(() => this.fetchApi())
        .then(() => {
          this.$swal({
            title: 'Sucesso',
            text: 'Editora cadastrada!',
            icon: 'success',
            allowOutsideClick: false,
          }).then(() => {
            window.Toast.fire('Editora cadastrada', '', 'success');
          });
        })
        .catch((e) => {
          this.$swal({
            title: 'Opss...',
            text: e.response.data.message,
            icon: 'info',
            allowOutsideClick: false,
          }).then(() => {
            window.Toast.fire('Erro ao cadastrar editora', '', 'error');
          });
        });
    },

    async update() {
      await publisherAccess
        .put(this.editedIndex, this.editedItem)
        .then(() => this.fetchApi())
        .then(() => {
          this.$swal({
            title: 'Sucesso',
            text: 'Editora alterada!',
            icon: 'success',
            allowOutsideClick: false,
          }).then(() => {
            window.Toast.fire('Editora alterada', '', 'success');
          });
        })
        .catch((e) => {
          this.$swal({
            title: 'Opss...',
            text: e.response.data.message,
            icon: 'info',
            allowOutsideClick: false,
          }).then(() => {
            window.Toast.fire('Erro ao editar editora', '', 'error');
          });
        });
    },

    async delete() {
      await publisherAccess
        .delete(this.editedIndex)
        .then(() => this.fetchApi())
        .then(() => {
          this.$swal({
            title: 'Sucesso',
            text: 'Editora deletada!',
            icon: 'success',
            allowOutsideClick: false,
          }).then(() => {
            window.Toast.fire('Editora deletada', '', 'info');
          });
        })
        .catch((e) => {
          this.$swal({
            title: 'Opss...',
            text: e.response.data.message,
            icon: 'info',
            allowOutsideClick: false,
          }).then(() => {
            window.Toast.fire('Erro ao deletar editora', '', 'error');
          });
        });
    },
  },
};
</script>

<style scoped>
.dataTable {
  width: 800px;
}
</style>