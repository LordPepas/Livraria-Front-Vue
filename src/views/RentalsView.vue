<template>
  <div class="d-flex flex-column justify-end align-end mt-2">
    <v-container>
      <v-row class="d-flex align-center" xs="vertical-center">
        <div class="header">
          <v-col cols="auto" class="ml-2">
            <v-toolbar-title class="font-weight-medium" style="font-size: 30px">Aluguéis</v-toolbar-title>
          </v-col>

          <v-col cols="auto">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 55" width="16" height="50">
                <rect width="3" height="55" rx="1"></rect>
              </svg>
            </div>
          </v-col>

          <v-col cols="">
            <v-btn class="rounded-lg px-0 v-btn v-btn--has-bg theme--dark" color="blue darken-3"
              style="height: 40px; min-width: 40px" @click="openModalCreate">
              <span class="v-btn__content">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="30" height="30" fill="currentColor">
                  <g>
                    <line x1="40" y1="128" x2="216" y2="128" fill="none" stroke="currentColor" stroke-linecap="round"
                      stroke-linejoin="round" stroke-width="24"></line>
                    <line x1="128" y1="40" x2="128" y2="216" fill="none" stroke="currentColor" stroke-linecap="round"
                      stroke-linejoin="round" stroke-width="24"></line>
                  </g>
                </svg>
              </span>
            </v-btn>
          </v-col>
        </div>
        <v-col cols="12" xs="12" sm="5" md="6" lg="6" class="mr-auto ml-auto mr-sm-2 mb-n6">
          <v-text-field dense outlined v-model="search" label="Pesquisar" prepend-inner-icon="mdi-magnify"
            no-data-text="Nenhum aluguel encontrado"></v-text-field>
        </v-col>
      </v-row>

      <v-data-table style="overflow-x: hidden" :headers="headers" :items="filteredRentals" :sort-by="['id']"
        :sort-desc="[false, true]" multi-sort :items-per-page="itemsPerPage" :header-props="headerProps" :footer-props="{
          itemsPerPageOptions: [5, 10, 25, -1],
          itemsPerPageText: 'Linhas por página',
        }" mobile-breakpoint="880" class="align-center px-4 py-4" no-data-text="Nenhum Aluguel encontrado">
        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon variant="plain" v-if="item.status === 'Não devolvido' &&
                parseDateISO(item.data_previsao) <=
                parseDateISO(item.data_aluguel)
                " color="warning" @click="openModalReturn(item)" v-on="on">
                mdi-book-clock-outline
              </v-icon>
            </template>
            <span>Devolver Livro em atraso</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon variant="plain" v-if="item.data_devolucao === 'Não devolvido' &&
                parseDateISO(item.data_previsao) >
                parseDateISO(item.data_aluguel)
                " color="success" @click="openModalReturn(item)" v-on="on">
                mdi-book-arrow-up-outline
              </v-icon>
            </template>
            <span>Devolver Livro</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon variant="plain" v-if="item.status === 'Não devolvido'" color="error" @click="openModalDelete(item)"
                v-on="on">
                mdi-trash-can-outline
              </v-icon>
            </template>
            <span>Excluir Aluguel</span>
          </v-tooltip>
        </template>

        <template v-slot:[`item.status`]="{ item }">
          <v-chip outlined :color="getStatusColorAndName(item).color" dark>
            {{ (item.status = getStatusColorAndName(item).name) }}
          </v-chip>
        </template>
      </v-data-table>
      <!-- FORM CREATE -->
      <v-row justify="center">
        <v-dialog v-model="Createdialog" max-width="600px" persistent>
          <v-card>
            <v-card-title>
              <span class="text-h5">Adicionar aluguel</span>
            </v-card-title>
            <v-card-text>
              <v-form ref="form" @submit.prevent="submitCreate">
                <v-autocomplete v-model="selectedBook" :items="availableBooks" :rules="selectBookRules" item-text="nome"
                  label="Nome do livro" append-icon="mdi-book-open-page-variant" required
                  no-data-text="Nenhuma editora encontrado"></v-autocomplete>
                <v-autocomplete v-model="selectedUser" :items="availableUsers" item-text="nome" :rules="selectedUserRules"
                  label="Nome do Cliente" append-icon="mdi-account" required
                  no-data-text="Nenhuma editora encontrado"></v-autocomplete>
                <v-menu ref="menu1" v-model="menu1" :close-on-content-click="false" transition="scale-transition" offset-y
                  max-width="290px" min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field disabled v-model="dateFormatted" label="Data de aluguel" hint="DD/MM/YYYY format"
                      :rules="dateFormattedRules" persistent-hint append-icon="mdi-calendar"
                      @blur="dateFormatted = formatDate(dateFormatted)" v-bind="attrs" v-on="on"></v-text-field>
                  </template>
                  <v-date-picker v-model="aluguelDate" no-title @input="menu1 = false"></v-date-picker>
                </v-menu>
                <v-menu ref="menu2" v-model="menu2" :close-on-content-click="false" transition="scale-transition" offset-y
                  max-width="290px" min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="previsaoDateFormatted" label="Previsão de devolução" hint="MM/DD/YYYY format"
                      :rules="previsaoDateRules" persistent-hint append-icon="mdi-calendar"
                      @blur="formattedPrevisaoDate = formatDate(previsaoDate)" v-bind="attrs" v-on="on"></v-text-field>
                  </template>
                  <v-date-picker v-model="previsaoDate" no-title @input="menu2 = false"></v-date-picker>
                </v-menu>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn class="mr-2" type="submit" :disabled="!$refs.form || !$refs.form.validate()" color="primary"
                    text>
                    Salvar
                  </v-btn>
                  <v-btn class="" @click="handleCancel" color="error" text>Cancelar</v-btn>
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
import Rentals from "@/services/Rentals";
import Books from "@/services/Books";
import Users from "@/services/Users";
import Swal from "sweetalert2";

export default {
  data() {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("pt-BR");
    const futureDate = new Date(
      currentDate.getTime() + 30 * 24 * 60 * 60 * 1000
    );
    const formattedPrevisaoDate = futureDate.toLocaleDateString("pt-BR");
    return {
      date: currentDate.toISOString().substr(0, 10),
      date2: futureDate.toISOString().substr(0, 10),
      rentals: [],
      dateFormatted: formattedDate,
      previsaoDateFormatted: formattedPrevisaoDate,
      availableUsers: [],
      availableBooks: [],
      search: "",
      selectedStatus: "",
      menu1: "",
      menu2: "",
      selectedBook: null,
      selectedUser: null,
      previsaoDate: futureDate.toISOString().substr(0, 10),
      aluguelDate: currentDate.toISOString().substr(0, 10),
      devolucaoDate: null,
      Createdialog: false,
      dialogReturn: false,
      selectedReantalId: null,
      isSaveButtonDisabled: false,
      headerProps: {
        sortByText: "Ordenar Por",
      },
      headers: [
        {
          text: "ID",
          align: "start",
          sortable: true,
          value: "id",
          class: "text-md-body-1 font-weight-bold ",
        },
        {
          text: "Livro",
          value: "livro_id",
          class: "text-md-body-1 font-weight-bold ",
        },
        {
          text: "Usuário",
          value: "usuario_id",
          class: "text-md-body-1 font-weight-bold ",
        },
        {
          text: "Aluguel",
          value: "data_aluguel",
          class: "text-md-body-1 font-weight-bold ",
        },
        {
          text: "Previsão",
          value: "data_previsao",
          class: "text-md-body-1 font-weight-bold ",
        },
        {
          text: "Devolução",
          value: "data_devolucao",
          class: "text-md-body-1 font-weight-bold ",
        },
        {
          text: "Status",
          value: "status",
          align: "center",
          sortable: false,
          class: "text-md-body-1 font-weight-bold ",
        },
        {
          text: "Ações",
          value: "actions",
          align: "center",
          sortable: false,
          class: "text-md-body-1 font-weight-bold ",
        },
      ],
      selectBookRules: [(v) => !!v || "O livro é obrigatório"],
      selectedUserRules: [(v) => !!v || "O usuário é obrigatório"],
      dateFormattedRules: [(v) => !!v || "A data de aluguel é obrigatório"],
      previsaoDateRules: [(v) => !!v || "A data de previsão é obrigatório"],
      currentPage: 5,
      itemsPerPage: -1,
    };
  },
  created() {
    this.fetchRentals();

    this.fetchRentals().then(() => {
      setTimeout(() => {
        this.itemsPerPage = 5;
      }, 1);
    });
  },
  computed: {
    filteredRentals() {
      const searchValue = this.search.toLowerCase();
      const statusValue = this.selectedStatus.toLowerCase();
      return this.rentals.filter((aluguel) => {
        for (const prop in aluguel) {
          const propValue = aluguel[prop].toString().toLowerCase();
          if (
            propValue.includes(searchValue) &&
            propValue.includes(statusValue)
          ) {
            return true;
          }
        }
        return false;
      });
    },
    totalPages() {
      return Math.ceil(this.paginatedRentals.length / this.itemsPerPage);
    },
    paginatedRentals() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.filteredRentals.slice(startIndex, endIndex);
    },
  },
  watch: {
    aluguelDate(newValue) {
      this.dateFormatted = this.formatDate(newValue);
    },
    previsaoDate(newValue) {
      this.previsaoDateFormatted = this.formatDate(newValue);
    },
    date() {
      this.aluguelDate = this.parseDateISO(this.dateFormatted);
    },
    date2() {
      this.previsaoDate = this.parseDateISO(this.previsaoDateFormatted);
    },
  },

  methods: {
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [day, month, year] = date.split("/");
      return `${year}-${month}-${day}`;
    },
    parseDateISO(date) {
      const [dd, mm, yyyy] = date.split("/");
      return `${yyyy}-${mm}-${dd}`;
    },
    getStatusColorAndName(item) {
      const allRentals = this.rentals;
      const rentalInList = allRentals.find((r) => r.id === item.id);

      if (rentalInList.data_devolucao !== "Não devolvido") {
        const devolucaoDate = this.parseDateISO(rentalInList.data_devolucao);
        const previsaoDate = this.parseDateISO(rentalInList.data_previsao);
        if (devolucaoDate > previsaoDate) {
          return { color: "error", name: "Com atraso" };
        } else {
          return { color: "success", name: "No prazo" };
        }
      } else {
        return { color: "primary", name: "Não devolvido" };
      }
    },
    /* ===== CRUD ===== */

    /* READ */
    async fetchRentals() {
      try {
        const [booksResponse, rentalsResponse, usersResponse] =
          await Promise.all([Books.read(), Rentals.read(), Users.read()]);

        this.availableBooks = booksResponse.data.map((livro) => ({
          id: livro.id,
          nome: livro.nome,
        }));

        this.availableUsers = usersResponse.data.map((usuario) => ({
          id: usuario.id,
          nome: usuario.nome,
        }));

        this.rentals = rentalsResponse.data.map((rental) => ({
          id: rental.id,
          livro_id: rental.livro_id.nome,
          usuario_id: rental.usuario_id.nome,
          data_aluguel: this.formatDate(rental.data_aluguel),
          data_previsao: this.formatDate(rental.data_previsao),
          data_devolucao: rental.data_devolucao
            ? this.formatDate(rental.data_devolucao)
            : "Não devolvido",
        }));
      } catch (error) {
        console.error("Erro ao buscar informações:", error);
      }
    },

    /* CREATE */
    resetValidation() {
      this.$refs.form.resetValidation();
    },

    handleCancel() {
      this.previsaoDate = this.date2;
      (this.selectedBook = ""),
        (this.selectedUser = ""),
        this.resetValidation();

      this.Createdialog = false;
      this.dialogReturn = false;
    },

    openModalCreate() {
      if (
        this.$refs.form &&
        typeof this.$refs.form.resetValidation === "function"
      ) {
        this.$refs.form.resetValidation();
      }
      this.Createdialog = true;
      this.aluguelDate = new Date().toISOString().substr(0, 10);
    },

    async submitCreate() {
      if (this.$refs.form && typeof this.$refs.form.validate === "function") {
        const isFormValid = await this.$refs.form.validate();
        if (isFormValid) {
          try {
            const selectedBook = this.availableBooks.find(
              (book) => book.nome === this.selectedBook
            );
            const selectedUser = this.availableUsers.find(
              (user) => user.nome === this.selectedUser
            );
            const newRental = {
              livro_id: selectedBook,
              usuario_id: selectedUser,
              data_aluguel: this.aluguelDate,
              data_previsao: this.previsaoDate,
            };
            console.log(newRental);
            const response = await Rentals.create(newRental);
            this.rentals.push({
              id: response.data.id,
              ...newRental,
            });
            this.fetchRentals();
            this.handleCancel();
            Swal.fire({
              icon: "success",
              title: "Aluguel adicionado com Sucesso!",
              showConfirmButton: false,
              timer: 2000,
              toast: true,
              position: "top-end",
              timerProgressBar: true,
            });
          } catch (error) {
            console.error("Erro ao adicionar aluguel:", error);
            Swal.fire({
              icon: "error",
              title: "Erro ao adicionar Aluguel",
              text: error.response.data.error,
              showConfirmButton: false,
              toast: true,
              position: "top-end",
              timer: 3000,
              timerProgressBar: true,
            });
          }
        }
      }
    },

    /* DELETE */
    openModalDelete(aluguel) {
      this.updateRental = { ...aluguel };
      Swal.fire({
        icon: "warning",
        title: `Deseja excluir o Aluguel do </br> ${aluguel.livro_id} ? `,
        showCancelButton: true,
        confirmButtonText: "Excluir!",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#5FA7D7",
        cancelButtonColor: "#E57373",
      }).then((result) => {
        if (result.isConfirmed) {
          this.submitDelete(this.updateRental);
        }
      });
    },
    async submitDelete(rental) {
      try {
        if (!rental.livro_id || !rental.usuario_id) {
          console.error("ID de livro_id ou usuario_id não definido.");
          return;
        }

        const selectedBook = this.availableBooks.find(
          (book) => book.nome === rental.livro_id
        );
        const selectedUser = this.availableUsers.find(
          (user) => user.nome === rental.usuario_id
        );

        const deleteRental = {
          id: rental.id,
          livro_id: selectedBook,
          usuario_id: selectedUser,
          data_aluguel: this.parseDateISO(rental.data_aluguel),
          data_previsao: this.parseDateISO(rental.data_previsao),
          data_devolucao:
            rental.data_devolucao !== "Não devolvido"
              ? rental.data_devolucao
              : null,
        };

        console.log("Resposta da Exclusão:", deleteRental);

        const response = await Rentals.delete(deleteRental);

        if (response.status === 200) {
          this.fetchRentals();
          Swal.fire({
            icon: "success",
            text: "Aluguel Excluído com Sucesso!",
            showConfirmButton: false,
            timer: 2000,
            toast: true,
            position: "top-end",
            timerProgressBar: true,
          });
        } else {
          Swal.fire({
            title: "Aluguel não deletado",
            text: response.data.error,
            showConfirmButton: false,
            icon: "info",
            timer: 2000,
            toast: true,
            position: "top-end",
            timerProgressBar: true,
          });
        }
      } catch (error) {
        console.error("Erro ao excluir aluguel:", error);

        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Ocorreu um erro ao excluir o aluguel.",
          showConfirmButton: false,
          timer: 2000,
          toast: true,
          position: "top-end",
          timerProgressBar: true,
        });
      }
    },

    async openModalReturn(rental) {
      this.updateRental = { ...rental };
      this.selectedReantalId = this.updateRental.id;
      this.selectedBook = this.availableBooks.find(
        (book) => book.nome === rental.livro_id
      );
      this.selectedUser = this.availableUsers.find(
        (user) => user.nome === rental.usuario_id
      );
      this.aluguelDate = this.updateRental.data_aluguel;
      this.previsaoDate = this.updateRental.data_previsao;
      this.devolucaoDate = this.updateRental.data_devolucao;
      const result = await Swal.fire({
        icon: "warning",
        title: "Você deseja devolver este livro?",
        text: `Devolver o livro: ${this.selectedBook.nome}`,
        showCancelButton: true,
        confirmButtonText: "Devolver!",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#5FA7D7",
        cancelButtonColor: "#E57373",
      });
      if (result.isConfirmed) {
        try {
          const returnRental = {
            id: this.selectedReantalId,
            livro_id: this.selectedBook,
            usuario_id: this.selectedUser,
            data_aluguel: this.parseDate(this.aluguelDate),
            data_previsao: this.parseDate(this.previsaoDate),
            data_devolucao: this.date,
          };
          console.log(returnRental);

          await Rentals.update(returnRental);
          this.rentals = this.rentals.map((rental) => {
            if (rental.id === returnRental.id) {
              return { ...rental, ...returnRental };
            } else {
              return rental;
            }
          });
          this.fetchRentals();
          this.handleCancel();
          await Swal.fire({
            icon: "success",
            title: "Livro Devolvido com Sucesso!",
            showConfirmButton: false,
            toast: true,
            position: "top-end",
            timer: 2000,
            timerProgressBar: true,
          });
        } catch (error) {
          await Swal.fire({
            icon: "info",
            title: "Livro não Devolvido",
            text: error.response.data.error,
            showConfirmButton: false,
            toast: true,
            position: "top-end",
            timer: 2000,
            timerProgressBar: true,
          });
        }
      }
    },
  },
};
</script>
<style scoped>
@media (max-width: 1600px) {

  ::v-deep .v-data-table>.v-data-table__wrapper>table>tbody>tr>td,
  ::v-deep .v-data-table>.v-data-table__wrapper>table>tbody>tr>th,
  ::v-deep .v-data-table>.v-data-table__wrapper>table>thead>tr>td,
  ::v-deep .v-data-table>.v-data-table__wrapper>table>thead>tr>th,
  ::v-deep .v-data-table>.v-data-table__wrapper>table>tfoot>tr>td,
  ::v-deep .v-data-table>.v-data-table__wrapper>table>tfoot>tr>th {
    padding: 0px 4px !important;
  }
}
</style>
