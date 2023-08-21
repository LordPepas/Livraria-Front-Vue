<template>
  <div class="d-flex flex-column justify-end align-end mt-2">
    <v-container>
      <v-row class="d-flex align-center">
        <div class="header">
          <v-col cols="auto ml-2">
            <v-toolbar-title class="font-weight-medium" style="font-size: 30px"
              >Usuários</v-toolbar-title
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
            no-data-text="Nenhum usuário encontrado"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-data-table
        min-width="690px"
        overflow-x="hidden"
        overflow-y="hidden"
        :headers="headers"
        :items="filteredUsers"
        :sort-by="['id']"
        :sort-desc="[false, true]"
        multi-sort
        :items-per-page="itemsPerPage"
        :header-props="headerProps"
        :footer-props="{
          itemsPerPageOptions: [5, 10, 25, 50],
          itemsPerPageText: 'Linhas por página',
        }"
        mobile-breakpoint="820"
        class="align-center px-4 py-4"
        no-data-text="Nenhum Cliente encontrado"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon
                variant="plain"
                color="info"
                @click="openModalUpdate(item)"
                v-on="on"
              >
                mdi-account-edit-outline
              </v-icon>
            </template>
            <span>Editar Usuário</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon
                variant="plain"
                color="error"
                @click="openModalDelete(item)"
                v-on="on"
              >
                mdi-trash-can-outline
              </v-icon>
            </template>
            <span>Excluir Usuário</span>
          </v-tooltip>
        </template>
      </v-data-table>

      <v-row justify="center">
        <!-- FORM CREATE/UPDATE -->
        <v-dialog v-model="dialogVisible" max-width="600px" persistent>
          <v-card>
            <v-card-title>
              <span class="text-h5">
                {{ selectedUserId ? "Editar usuário" : "Adicionar usuário" }}
              </span>
            </v-card-title>
            <v-card-text>
              <v-form ref="form" @submit.prevent="submitAction">
                <v-text-field
                  v-model="name"
                  :rules="nameRules"
                  :counter="45"
                  label="Nome do usuário"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="email"
                  :rules="emailRules"
                  :counter="120"
                  label="Email do usuário"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="city"
                  :rules="cityRules"
                  :counter="25"
                  label="Cidade do usuário"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="address"
                  :rules="addressRules"
                  :counter="25"
                  label="Endereço do usuário"
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
import Users from "@/services/Users.js";
import Swal from "sweetalert2";
export default {
  data() {
    return {
      fetchUser: [],
      search: "",
      name: "",
      email: "",
      city: "",
      address: "",
      submitButtonLabel: "",
      dialogVisible: false,
      isSaveButtonDisabled: false,
      selectedUserId: null,
      headerProps: {
        sortByText: "Ordenar Por",
      },
      nameRules: [
        (v) => !!v || "O nome é obrigatório",
        (v) => v.length <= 45 || "O nome deve ter no máximo 45 caracteres",
      ],
      emailRules: [
        (v) => !!v || "O email é obrigatório",
        (v) => v.length <= 120 || "O email deve ter no máximo 120 caracteres",
        (v) => this.isValidEmail(v) || "Formato de email inválido",
      ],
      cityRules: [
        (v) => !!v || "A cidade é obrigatória",
        (v) => v.length <= 25 || "A cidade deve ter no máximo 25 caracteres",
      ],
      addressRules: [
        (v) => !!v || "O endereço é obrigatório",
        (v) => v.length <= 50 || "O endereço deve ter no máximo 50 caracteres",
      ],
      headers: [
        {
          text: "ID",
          align: "start",
          sortable: true,
          value: "id",
          class: "text-md-body-1 font-weight-bold ",
          padding: "8",
        },
        {
          text: "Nome",
          value: "nome",
          class: "text-md-body-1 font-weight-bold ",
        },
        {
          text: "Email",
          value: "email",
          class: "text-md-body-1 font-weight-bold ",
        },
        {
          text: "Cidade",
          value: "cidade",
          class: "text-md-body-1 font-weight-bold ",
        },
        {
          text: "Endereço",
          value: "endereco",
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
    this.fetchUsers();
  },
  computed: {
    filteredUsers() {
      const searchValue = this.search.toLowerCase();
      return this.fetchUser.filter((usuario) => {
        for (const prop in usuario) {
          const propValue = usuario[prop].toString().toLowerCase();
          if (propValue.includes(searchValue)) {
            return true;
          }
        }
        return false;
      });
    },
    totalPages() {
      return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    },
    paginatedUsers() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.filteredUsers.slice(startIndex, endIndex);
    },
  },
  methods: {
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    /* ===== CRUD ===== */

    /* READ */
    async fetchUsers() {
      try {
        const response = await Users.read();
        this.fetchUser = response.data;
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    },

    /* CREATE/UPDATE */

    resetValidation() {
      this.$refs.form.resetValidation();
    },

    handleCancel() {
      this.name = "";
      this.email = "";
      this.city = "";
      this.address = "";
      this.selectedUserId = null;
      this.dialogVisible = false;
      this.resetValidation();
    },

    openModalCreate() {
      if (
        this.$refs.form &&
        typeof this.$refs.form.resetValidation === "function"
      ) {
        this.$refs.form.resetValidation();
      }
      this.dialogVisible = true;
      this.submitButtonLabel = "Salvar";
    },

    openModalUpdate(user) {
      this.selectedUserId = user.id;
      this.name = user.nome;
      this.email = user.email;
      this.city = user.cidade;
      this.address = user.endereco;
      this.dialogVisible = true;
      this.submitButtonLabel = "Atualizar";
    },

    async submitAction() {
      const userData = {
        nome: this.name,
        email: this.email,
        cidade: this.city,
        endereco: this.address,
      };
      if (!this.selectedUserId) {
        try {
          const response = await Users.create(userData);
          this.fetchUser.push({ id: response.data.id, ...userData });
          Swal.fire({
            icon: "success",
            title: "Usuário adicionado com Sucesso!",
            showConfirmButton: false,
            timer: 2000,
            toast: true,
            position: "top-end",
            timerProgressBar: true,
          });
          this.handleCancel();
          this.fetchUsers();
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Erro ao adicionar Usuário",
            text: error.response.data.error,
            showConfirmButton: false,
            toast: true,
            position: "top-end",
            timer: 3000,
            timerProgressBar: true,
          });
        }
      } else {
        const updateUser = {
          id: this.selectedUserId,
          ...userData,
        };
        try {
          await Users.update(updateUser);
          this.fetchUser = this.fetchUser.map((user) => {
            if (user.id === updateUser.id) {
              return updateUser;
            } else {
              return user;
            }
          });
          Swal.fire({
            icon: "success",
            title: "Usuário atualizado com Sucesso!",
            showConfirmButton: false,
            timer: 2000,
            toast: true,
            position: "top-end",
            timerProgressBar: true,
          });
          this.handleCancel();
          this.fetchUsers();
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Erro ao atualizar Usuário",
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
    async openModalDelete(user) {
      const result = await Swal.fire({
        icon: "warning",
        title: "Deseja excluir o usuário?",
        text: "Essa ação não pode ser Desfeita!",
        showCancelButton: true,
        confirmButtonText: "Excluir!",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#5FA7D7",
        cancelButtonColor: "#E57373",
      });

      if (result.isConfirmed) {
        try {
          await Users.delete(user);
          Swal.fire({
            icon: "success",
            title: "Usuário Excluído com Sucesso!",
            showConfirmButton: false,
            timer: 2000,
            toast: true,
            position: "top-end",
            timerProgressBar: true,
          });
          this.handleCancel();
          this.fetchUsers();
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Erro ao Excluir Usuário",
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
