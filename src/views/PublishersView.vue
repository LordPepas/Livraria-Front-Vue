<template>
  <div class="d-flex flex-column justify-end align-end mt-2">
    <v-container>
      <v-row class="d-flex align-center">
        <div class="header">
          <v-col cols="auto ml-2">
            <v-toolbar-title class="font-weight-medium" style="font-size: 30px"
              >Editoras</v-toolbar-title
            >
          </v-col>
          <v-col cols="auto">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 3 55"
                width="16"
                height="55"
              >
                <rect width="3" height="55" rx="1"></rect>
              </svg>
            </div>
          </v-col>

          <v-col cols="auto">
            <v-btn
              class="rounded-lg px-0 v-btn v-btn--has-bg theme--dark"
              color="blue darken-3"
              style="height: 40px; min-width: 40px"
              @click="openModalCreate"
            >
              <span class="v-btn__content">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 256 256"
                  width="30"
                  height="30"
                  fill="currentColor"
                >
                  <g>
                    <line
                      x1="40"
                      y1="128"
                      x2="216"
                      y2="128"
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="24"
                    ></line>
                    <line
                      x1="128"
                      y1="40"
                      x2="128"
                      y2="216"
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="24"
                    ></line>
                  </g>
                </svg>
              </span>
            </v-btn>
          </v-col>
        </div>
        <v-col
          cols="12"
          xs="12"
          sm="5"
          md="6"
          lg="6"
          class="mr-auto ml-auto mr-sm-2 mb-n6"
        >
          <v-text-field
            dense
            outlined
            v-model="search"
            label="Pesquisar"
            prepend-inner-icon="mdi-magnify"
            no-data-text="Nenhuma editora encontrado"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-data-table
        :headers="headers"
        :items="filteredPublishers"
        :sort-by="['id']"
        :header-props="headerProps"
        :sort-desc="[false, true]"
        multi-sort
        :items-per-page="itemsPerPage"
        :footer-props="{
          itemsPerPageOptions: [5, 10, 25, 50],
          itemsPerPageText: 'Linhas por página',
        }"
        mobile-breakpoint="820"
        class="align-center px-4 py-4"
        no-data-text="Nenhuma Editora encontrado"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon variant="plain" color="info" @click="openModalUpdate(item)"
            >mdi-storefront-edit-outline</v-icon
          >
          <v-icon variant="plain" color="error" @click="openModalDelete(item)"
            >mdi-trash-can-outline</v-icon
          >
        </template>
        <template v-slot:[`item.editora`]="{ item }">
          {{ item.editora.nome }}
        </template>
      </v-data-table>
      <v-row justify="center">
        <!-- FORM CREATE/UPDATE -->
        <v-dialog v-model="dialogVisible" max-width="600px" persistent>
          <v-card>
            <v-card-title>
              <span class="text-h5">
                {{
                  selectedPublisherId ? "Editar editora" : "Adicionar editora"
                }}
              </span>
            </v-card-title>
            <v-card-text>
              <v-form ref="form" @submit.prevent="submitAction">
                <v-text-field
                  v-model="name"
                  :rules="nameRules"
                  :counter="25"
                  label="Nome da editora"
                  append-icon="mdi-bookshelf"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="city"
                  :rules="cityRules"
                  :counter="25"
                  label="Cidade da editora"
                  append-icon="mdi-city-variant-outline"
                  required
                ></v-text-field>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    class="mr-2"
                    type="submit"
                    :disabled="!$refs.form || !$refs.form.validate()"
                    color="primary"
                    text
                  >
                    {{ submitButtonLabel }}
                  </v-btn>
                  <v-btn class="" @click="handleCancel" color="error" text
                    >Cancelar</v-btn
                  >
                </v-card-actions>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Publisher from "@/services/Publishers";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      fetchPublisher: [],
      search: "",
      name: "",
      city: "",
      submitButtonLabel: "",
      dialogVisible: false,
      selectedPublisherId: null,
      headerProps: {
        sortByText: "Ordenar Por",
      },
      nameRules: [
        (v) => !!v || "O nome é obrigatório",
        (v) => v.length <= 25 || "O nome deve ter no máximo 25 caracteres",
      ],
      cityRules: [
        (v) => !!v || "A cidade é obrigatória",
        (v) => v.length <= 25 || "A cidade deve ter no máximo 25 caracteres",
      ],
      headers: [
        {
          text: "ID",
          align: "start",
          sortable: true,
          value: "id",
          class: "text-md-body-1 font-weight-bold ",
        },
        {
          text: "Nome",
          value: "nome",
          class: "text-md-body-1 font-weight-bold ",
        },
        {
          text: "Cidade",
          value: "cidade",
          class: "text-md-body-1 font-weight-bold ",
        },
        {
          text: "Ações",
          value: "actions",
          sortable: false,
          class: "text-md-body-1 font-weight-bold ",
        },
      ],
      currentPage: 1,
      itemsPerPage: 5,
    };
  },
  created() {
    this.fetchPublishers();
  },
  computed: {
    filteredPublishers() {
      const searchValue = this.search.toLowerCase();
      return this.fetchPublisher.filter((publisher) => {
        for (const prop in publisher) {
          const propValue = publisher[prop].toString().toLowerCase();
          if (propValue.includes(searchValue)) {
            return true;
          }
        }
        return false;
      });
    },
    totalPages() {
      return Math.ceil(this.filteredPublishers.length / this.itemsPerPage);
    },
    paginatedPublishers() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.filteredPublishers.slice(startIndex, endIndex);
    },
  },
  methods: {
    /* ===== CRUD ===== */

    /* READ */
    async fetchPublishers() {
      try {
        const response = await Publisher.read();
        this.fetchPublisher = response.data;
      } catch (error) {
        console.error("Erro ao buscar editoras:", error);
      }
    },

    /* CREATE/UPDATE */

    resetValidation() {
      this.$refs.form.resetValidation();
    },

    handleCancel() {
      this.name = "";
      this.city = "";
      this.selectedPublisherId = null;
      this.resetValidation();

      this.dialogVisible = false;
    },

    openModalCreate() {
      if (
        this.$refs.form &&
        typeof this.$refs.form.resetValidation === "function"
      ) {
        this.$refs.form.resetValidation();
      }
      this.name = "";
      this.city = "";
      this.selectedPublisherId = null;
      this.dialogVisible = true;
      this.submitButtonLabel = "Salvar";
    },

    openModalUpdate(publisher) {
      this.selectedPublisherId = publisher.id;
      this.name = publisher.nome;
      this.city = publisher.cidade;
      this.dialogVisible = true;
      this.submitButtonLabel = "Atualizar";
    },

    async submitAction() {
      const publisherData = {
        nome: this.name,
        cidade: this.city,
      };
      if (!this.selectedPublisherId) {
        try {
          const response = await Publisher.create(publisherData);
          this.fetchPublisher.push({
            id: response.data.id,
            ...publisherData,
          });
          Swal.fire({
            icon: "success",
            title: "Editora adicionada com Sucesso!",
            showConfirmButton: false,
            timer: 2000,
            toast: true,
            position: "top-end",
            timerProgressBar: true,
          });
          this.handleCancel();
          this.fetchPublishers();
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Erro ao adicionar Editora",
            text: error.response.data.error,
            showConfirmButton: false,
            toast: true,
            position: "top-end",
            timer: 3000,
            timerProgressBar: true,
          });
        }
      } else {
        const updatePublisher = {
          id: this.selectedPublisherId,
          ...publisherData,
        };
        try {
          await Publisher.update(updatePublisher);
          this.fetchPublisher = this.fetchPublisher.map((publisher) => {
            if (publisher.id === updatePublisher.id) {
              return updatePublisher;
            } else {
              return publisher;
            }
          });
          Swal.fire({
            icon: "success",
            title: "Editora atualizada com Sucesso!",
            showConfirmButton: false,
            timer: 2000,
            toast: true,
            position: "top-end",
            timerProgressBar: true,
          });
          this.handleCancel();
          this.fetchPublishers();
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Erro ao atualizar Editora",
            text: error.response.data.error,
            showConfirmButton: false,
            toast: true,
            position: "top-end",
            timer: 3000,
            timerProgressBar: true,
          });
        }
      }
    },

    /* DELETE */
    async openModalDelete(publisher) {
      const result = await Swal.fire({
        icon: "warning",
        title: "Deseja excluir o produto?",
        text: "Essa ação não pode ser Desfeita!",
        showCancelButton: true,
        confirmButtonText: "Excluir!",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#5FA7D7",
        cancelButtonColor: "#E57373",
      });

      if (result.isConfirmed) {
        try {
          await Publisher.delete(publisher);

          await Swal.fire({
            icon: "success",
            title: "Editora Excluída com Sucesso!",
            showConfirmButton: false,
            timer: 2000,
            toast: true,
            position: "top-end",
            timerProgressBar: true,
          });
          this.handleCancel();
          this.fetchPublishers();
        } catch (error) {
          await Swal.fire({
            icon: "error",
            title: "Erro ao Excluir Editora",
            text: error.response.data.error,
            showConfirmButton: false,
            timer: 3000,
            toast: true,
            position: "top-end",
            timerProgressBar: true,
          });
        }
      }
    },
  },
};
</script>
