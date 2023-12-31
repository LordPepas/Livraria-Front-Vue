<template>
  <div class="d-flex flex-column justify-end align-end mt-2">
    <v-container>
      <v-row class="d-flex align-center" xs="vertical-center">
        <v-col cols="auto" class="ml-2">
          <v-toolbar-title class="font-weight-medium" style="font-size: 30px"
            >Livros</v-toolbar-title
          >
        </v-col>
        <v-col cols="auto">
          <img src="@/assets/divider.svg" />
        </v-col>
        <v-col cols="">
          <v-btn
            class="rounded-lg px-0 v-btn v-btn--has-bg theme--dark"
            color="blue darken-3"
            style="height: 40px; min-width: 40px"
            @click="openModalCreate"
          >
            <img src="@/assets/plus.svg" />
          </v-btn>
        </v-col>
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
          ></v-text-field>
        </v-col>
      </v-row>

      <v-data-table
        :headers="headers"
        :items="filteredBooks"
        :sort-by="['id']"
        :sort-desc="[false, true]"
        multi-sort
        :items-per-page="itemsPerPage"
        :footer-props="{
          itemsPerPageOptions: [5, 10, 25, 50],
          itemsPerPageText: 'Linhas por página',
        }"
        mobile-breakpoint="820"
        class="align-center px-4 py-4"
        no-data-text="Nenhum Livro encontrado"
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
                mdi-notebook-edit-outline
              </v-icon>
            </template>
            <span>Editar Livro</span>
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
            <span>Excluir Livro</span>
          </v-tooltip>
        </template>
      </v-data-table>
      <!-- FORM CREATE/UPDATE -->
      <v-row justify="center">
        <v-dialog v-model="dialogVisible" max-width="600px" persistent>
          <v-card>
            <v-card-title>
              <span class="text-h5">
                {{ selectedBookId ? "Editar livro" : "Adicionar livro" }}
              </span>
            </v-card-title>
            <v-card-text>
              <v-form ref="form" @submit.prevent="submitAction">
                <v-text-field
                  v-model="name"
                  :rules="nameRules"
                  :counter="45"
                  label="Título do livro"
                  append-icon="mdi-book-open-page-variant"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="author"
                  :rules="authorRules"
                  :counter="45"
                  label="Autor"
                  append-icon="mdi-account"
                  required
                ></v-text-field>
                <v-autocomplete
                  v-model="publishers"
                  :rules="publishersRules"
                  :items="listPublishers"
                  item-text="nome"
                  label="Editora do Livro"
                  append-icon="mdi-bookshelf"
                  required
                  no-data-text="Nenhuma editora encontrado"
                ></v-autocomplete>
                <v-text-field
                  v-model="launch"
                  :rules="launchRules"
                  label="Data de lançamento"
                  :counter="4"
                  type="number"
                  append-icon="mdi-calendar"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="quantity"
                  :rules="quantityRules"
                  label="Quantidade de livros"
                  :counter="100"
                  type="number"
                  append-icon="mdi-book-multiple-outline"
                  required
                ></v-text-field>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    class="mr-2"
                    type="submit"
                    :disabled="!isSubmitDisabled && !$refs.form.validate()"
                    color="primary"
                    text
                  >
                    {{ submitButtonLabel }}
                  </v-btn>
                  <v-btn class="" @click="closeModal" color="error" text
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
import Publishers from "@/services/Publishers";
import Swal from "sweetalert2";
import Books from "@/services/Books";

export default {
  data() {
    return {
      fetchBook: [],
      listPublishers: [],
      search: "",
      name: "",
      publishers: "",
      author: "",
      quantity: "",
      launch: "",
      dialogVisible: false,
      submitButtonLabel: "",
      selectedBookId: null,
      isSubmitDisabled: true,
      headers: [
        {
          text: "ID",
          align: "start",
          sortable: true,
          value: "id",
          padding: "2px",
          class: "text-md-body-1 font-weight-bold ",
        },
        {
          text: "Nome",
          align: "center",
          value: "nome",
          class: "text-md-body-1 font-weight-bold ",
        },
        {
          text: "Autor",
          align: "center",
          value: "autor",
          class: "text-md-body-1 font-weight-bold ",
        },
        {
          text: "Editora",
          value: "editora",
          align: "center",
          class: "text-md-body-1 font-weight-bold ",
        },
        {
          text: "Lançamento",
          value: "lancamento",
          align: "center",
          class: "text-md-body-1 font-weight-bold ",
        },
        {
          text: "Quantidade",
          value: "quantidade",
          align: "center",
          class: "text-md-body-1 font-weight-bold ",
        },
        {
          text: "Alugados",
          value: "totalalugado",
          align: "center",
          class: "text-md-body-1 font-weight-bold ",
        },
        {
          text: "Ações",
          value: "actions",
          sortable: false,
          align: "center",
          class: "text-md-body-1 font-weight-bold ",
        },
      ],
      nameRules: [
        (v) => !!v || "O título é obrigatório",
        (v) => v.length <= 45 || "O título deve ter no máximo 45 caracteres",
      ],
      authorRules: [
        (v) => !!v || "O autor é obrigatório",
        (v) => v.length <= 50 || "O autor deve ter no máximo 50 caracteres",
      ],
      publishersRules: [(v) => !!v || "A editora é obrigatório"],
      launchRules: [
        (v) => !!v || "O lançamento é obrigatório",
        (v) => /^\d{4}$/.test(v) || "Formato de data inválido (YYYY)",
      ],
      quantityRules: [
        (v) => !!v || "A quantidade é obrigatório",
        (v) => v >= 0 || "A quantidade nao deve ser menor que um",
        (v) => v <= 100 || "A quantidade deve ser menor que cem",
      ],
      currentPage: 1,
      itemsPerPage: 5,
    };
  },
  created() {
    this.listBooks();
  },
  computed: {
    filteredBooks() {
      const searchValue = this.search.toLowerCase();
      return this.fetchBook.filter((book) => {
        for (const prop in book) {
          const propValue = book[prop].toString().toLowerCase();
          if (propValue.includes(searchValue)) {
            return true;
          }
        }
        return false;
      });
    },
    totalPages() {
      return Math.ceil(this.filteredBooks.length / this.itemsPerPage);
    },
    paginatedBooks() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.filteredBooks.slice(startIndex, endIndex);
    },
  },
  methods: {
    /* ===== CRUD ===== */

    /* READ */
    async listBooks() {
      try {
        const publisherResponse = await Publishers.read();
        this.listPublishers = publisherResponse.data.map((editora) => ({
          id: editora.id,
          nome: editora.nome,
        }));

        const booksResponse = await Books.read();
        this.fetchBook = booksResponse.data.map((book) => ({
          id: book.id,
          nome: book.nome,
          autor: book.autor,
          editora: book.editora.nome,
          lancamento: book.lancamento,
          quantidade: book.quantidade,
          totalalugado: book.totalalugado,
        }));
      } catch (error) {
        console.error("Erro ao buscar editoras e livros:", error);
      }
    },

    /* CREATE/UPDATE */
    resetValidation() {
      this.$refs.form.resetValidation();
    },

    closeModal() {
      (this.selectedBookId = null), (this.name = "");
      this.author = "";
      this.publishers = "";
      this.launch = "";
      this.quantity = "";
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
      this.isSubmitDisabled = true;
      this.submitButtonLabel = "Salvar";
    },

    openModalUpdate(book) {
      this.dialogVisible = true;
      this.isSubmitDisabled = true;
      this.submitButtonLabel = "Atualizar";
      this.selectedBookId = book.id;
      this.name = book.nome;
      this.author = book.autor;
      const selectedPublisher = this.listPublishers.find(
        (publisher) => publisher.nome === book.editora
      );
      this.publishers = selectedPublisher;

      this.launch = book.lancamento;
      this.quantity = book.quantidade;
    },

    async submitAction() {
      if (this.$refs.form && typeof this.$refs.form.validate === "function") {
        const isFormValid = await this.$refs.form.validate();
        if (!isFormValid) {
          this.isSubmitDisabled = false;
          return;
        }
        const selectedPublisher = this.listPublishers.find(
          (publisher) => publisher.nome === this.publishers
        );

        const bookData = {
          nome: this.name,
          autor: this.author,
          editora: selectedPublisher
            ? { id: selectedPublisher.id, nome: selectedPublisher.nome }
            : this.publishers,
          lancamento: this.launch,
          quantidade: this.quantity,
        };
        try {
          if (!this.selectedBookId) {
            try {
              const response = await Books.create(bookData);
              this.fetchBook.push({ id: response.data.id, ...bookData });
              this.closeModal();
              this.listBooks();
              Swal.fire({
                icon: "success",
                title: "Livro adicionado com Sucesso!",
                showConfirmButton: false,
                timer: 2000,
                toast: true,
                position: "top-end",
                timerProgressBar: true,
              });
            } catch (error) {
              Swal.fire({
                icon: "error",
                title: "Erro ao adicionar Livro",
                text: error.response.data.error,
                showConfirmButton: false,
                toast: true,
                position: "top-end",
                timer: 3000,
                timerProgressBar: true,
              });
            }
          } else {
            const totalalugado = this.fetchBook.find(
              (publisher) => publisher.id === this.selectedBookId
            );
            const update = {
              id: this.selectedBookId,
              ...bookData,
              totalalugado: totalalugado.totalalugado,
            };
            try {
              this.closeModal();
              this.listBooks();
              await Books.update(update);
              this.fetchBook = this.fetchBook.map((book) => {
                if (book.id === update.id) {
                  return { ...book, ...update };
                } else {
                  return book;
                }
              });
              Swal.fire({
                icon: "success",
                title: "Livro atualizado com Sucesso!",
                showConfirmButton: false,
                timer: 2000,
                toast: true,
                position: "top-end",
                timerProgressBar: true,
              });
            } catch (error) {
              Swal.fire({
                icon: "error",
                title: "Erro ao atualizar Livro",
                text: error.response.data.error,
                showConfirmButton: false,
                toast: true,
                position: "top-end",
                timer: 3000,
                timerProgressBar: true,
              });
            }
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Erro ao realizar ação",
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

    async openModalDelete(book) {
      const selectedPublisher = this.listPublishers.find(
        (editora) => editora.nome === book.editora
      );
      const deleteBook = {
        id: book.id,
        nome: book.nome,
        autor: book.autor,
        editora: selectedPublisher,
        lancamento: book.lancamento,
        quantidade: book.quantidade,
        totalalugado: book.totalalugado,
      };
      const result = await Swal.fire({
        icon: "warning",
        title: `Deseja excluir o Livro</br> ${deleteBook.nome} ? `,
        text: "Essa ação não pode ser desfeita!",
        showCancelButton: true,
        confirmButtonText: "Excluir!",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#5FA7D7",
        cancelButtonColor: "#E57373",
      });

      if (result.isConfirmed) {
        this.listBooks();
        this.closeModal();
        try {
          await Books.delete(deleteBook);
          await Swal.fire({
            icon: "success",
            title: "Livro Excluída com Sucesso!",
            showConfirmButton: false,
            timer: 2000,
            toast: true,
            position: "top-end",
            timerProgressBar: true,
          });
        } catch (error) {
          await Swal.fire({
            icon: "info",
            title: "Livro não deletado",
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
