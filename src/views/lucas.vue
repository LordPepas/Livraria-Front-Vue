<template>
    <div id="alugueis">
        <v-app id="inspire">
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark elevation-4">
                <v-col cols="11" style="margin: auto; padding: 7px 0px">
                    <nav class="navbar navbar-expand-lg">
                        <img src="../assets/logo_wda5.png" />
                        <div class="container-fluid">
                            <button
                                class="navbar-toggler"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#navbarSupportedContent"
                                aria-controls="navbarSupportedContent"
                                aria-expanded="false"
                                aria-label="Toggle navigation"
                            >
                                <span class="navbar-toggler-icon"></span>
                            </button>
                            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                    <li class="nav-item">
                                        <router-link class="nav-link " to="/" aria-current="page" href="#">
                                            <v-icon
                                                style="color:#838383; margin-top: -3px; margin-right: 4px; font-size: 20px"
                                                >mdi-home</v-icon
                                            >Início</router-link
                                        >
                                    </li>
                                    <li class="nav-item">
                                        <router-link class="nav-link" to="/usuarios" href="#"
                                            ><v-icon
                                                style="color:#838383; margin-top: -3px; margin-right: 4px; font-size: 20px"
                                                >mdi-account-multiple</v-icon
                                            >Usuários</router-link
                                        >
                                    </li>

                                    <li class="nav-item">
                                        <router-link class="nav-link " to="/editoras"
                                            ><v-icon
                                                style="color:#838383; margin-top: -3px; margin-right: 4px; font-size: 20px"
                                                >mdi-bookshelf</v-icon
                                            >Editoras</router-link
                                        >
                                    </li>
                                    <li class="nav-item">
                                        <router-link class="nav-link" to="/livros" href="#"
                                            ><v-icon
                                                style="color:#838383; margin-top: -3px; margin-right: 4px; font-size: 20px"
                                                >mdi-book-multiple</v-icon
                                            >Livros</router-link
                                        >
                                    </li>
                                    <li class="nav-item">
                                        <router-link class="nav-link active" to="/alugueis" href="#"
                                            ><v-icon
                                                style="color:white; margin-top: -3px; margin-right: 4px; font-size: 20px"
                                                >mdi-calendar-clock</v-icon
                                            >Aluguéis</router-link
                                        >
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </v-col>
            </nav>
            <v-col cols="11" style="margin: auto; flex: 1; ">
                <v-data-table
                    :loading="isLoading"
                    :headers="headers"
                    :items="alugueis"
                    :items-per-page="5"
                    :search="search"
                    class="elevation-5"
                >
                    <template v-slot:top>
                        <v-toolbar flat color="#212529">
                            <v-toolbar-title style="color: white">Lista de Alugueis</v-toolbar-title>

                            <v-divider class="mx-4" inset vertical></v-divider>

                            <v-text-field
                                dark
                                v-model="search"
                                append-icon="mdi-magnify"
                                label="Search"
                                single-line
                                hide-details
                            ></v-text-field>
                            <v-spacer></v-spacer>
                            <v-dialog v-model="dialog" max-width="500px">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                        color="#198754"
                                        dark
                                        class="mb-2"
                                        style="margin-top: 9px;"
                                        v-bind="attrs"
                                        v-on="on"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            class="bi bi-plus-lg icone"
                                            style="margin-right: 5px; margin-bottom: 0px"
                                            viewBox="0 0 16 16"
                                        >
                                            <path
                                                d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z"
                                            />
                                        </svg>
                                        Novo Aluguel
                                    </v-btn>
                                </template>

                                <v-card>
                                    <v-card-title>
                                        <span class="text-h5">{{ formTitle }}</span>
                                    </v-card-title>

                                    <v-card-text>
                                        <v-container>
                                            <v-form ref="form" v-model="valid" lazy-validation>
                                                <v-select
                                                    v-if="editedIndex == -1"
                                                    v-model="editedItem.usuario_id"
                                                    :rules="usuarioRules"
                                                    :items="usuarios"
                                                    item-text="nome"
                                                    item-value="id"
                                                    append-icon="mdi-account"
                                                    label="Usuario*"
                                                    return-object
                                                    required
                                                    color="#198754"
                                                ></v-select>

                                                <v-select
                                                    v-if="editedIndex == -1"
                                                    v-model="editedItem.livro_id"
                                                    :rules="livroRules"
                                                    :items="disponiveis"
                                                    item-text="nome"
                                                    item-value="id"
                                                    label="Livro*"
                                                    append-icon="mdi-book"
                                                    return-object
                                                    required
                                                    color="#198754"
                                                ></v-select>

                                                <v-menu
                                                    v-if="editedIndex == -1"
                                                    ref="menu1"
                                                    v-model="menu1"
                                                    :close-on-content-click="false"
                                                    :nudge-right="40"
                                                    transition="scale-transition"
                                                    offset-y
                                                    min-width="auto"
                                                >
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-text-field
                                                            v-model="editedItem.data_aluguel"
                                                            :rules="data_aluguelRules"
                                                            label="Data de aluguel*"
                                                            required
                                                            id="aluguel"
                                                            append-icon="mdi-calendar"
                                                            readonly
                                                            v-bind="attrs"
                                                            @blur="date = parseDate(editedItem.data_aluguel)"
                                                            v-on="on"
                                                            color="#198754"
                                                        ></v-text-field>
                                                    </template>

                                                    <v-date-picker
                                                        :max="dataAtual"
                                                        :min="dataAtual"
                                                        v-model="date"
                                                        @input="menu1 = false"
                                                        color="#198754"
                                                    ></v-date-picker>
                                                </v-menu>

                                                <v-menu
                                                    v-if="editedIndex == -1"
                                                    v-model="menu2"
                                                    :close-on-content-click="false"
                                                    :nudge-right="40"
                                                    transition="scale-transition"
                                                    offset-y
                                                    max-width="290px"
                                                    min-width="auto"
                                                >
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-text-field
                                                            v-model="editedItem.data_previsao"
                                                            :rules="data_previsaoRules"
                                                            label="Data de previsão*"
                                                            required
                                                            append-icon="mdi-calendar"
                                                            readonly
                                                            id="previsao"
                                                            v-bind="attrs"
                                                            @blur="date1 = parseDate(editedItem.data_previsao)"
                                                            v-on="on"
                                                            color="#198754"
                                                        ></v-text-field>
                                                    </template>

                                                    <v-date-picker
                                                        v-model="date1"
                                                        :min="dataAtual"
                                                        @input="menu2 = false"
                                                        color="#198754"
                                                    ></v-date-picker>
                                                </v-menu>
                                                <v-menu
                                                    v-if="editedIndex != -1"
                                                    v-model="menu3"
                                                    :close-on-content-click="false"
                                                    :nudge-right="40"
                                                    transition="scale-transition"
                                                    offset-y
                                                    max-width="290px"
                                                    min-width="auto"
                                                >
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-text-field
                                                            v-model="editedItem.data_devolucao"
                                                            :rules="data_devolucaoRules"
                                                            label="Data de devolução*"
                                                            required
                                                            id="devolucao"
                                                            append-icon="mdi-calendar"
                                                            readonly
                                                            v-bind="attrs"
                                                            @blur="date2 = parseDate(editedItem.data_devolucao)"
                                                            v-on="on"
                                                            color="#198754"
                                                        ></v-text-field>
                                                    </template>
                                                    <v-date-picker
                                                        :max="dataAtual"
                                                        :min="dataAtual"
                                                        v-model="date2"
                                                        @input="menu3 = false"
                                                        color="#198754"
                                                    ></v-date-picker>
                                                </v-menu>
                                            </v-form>
                                        </v-container>
                                    </v-card-text>

                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="red" text @click="close">
                                            Cancelar
                                        </v-btn>
                                        <v-btn color="blue darken-1" text @click="reset">
                                            Resetar
                                        </v-btn>
                                        <v-btn color="#198754" text @click="save" :disabled="!valid">
                                            {{ saveEdit }}
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-toolbar>
                    </template>
                    <template v-slot:[`item.status`]="{ item }">
                        <v-chip outlined v-if="item.data_devolucao == null" color="primary">
                            {{ (item.status = 'Não devolvido') }}
                        </v-chip>
                        <v-chip
                            outlined
                            v-else-if="item.data_devolucao.valueOf() > item.data_previsao.valueOf()"
                            color="red"
                            dark
                        >
                            {{ (item.status = 'Com atraso') }}
                        </v-chip>
                        <v-chip outlined v-else color="#198754" dark>
                            {{ (item.status = 'No prazo') }}
                        </v-chip>
                    </template>

                    <template v-slot:[`item.data_devolucao`]="{ item }">
                        <div v-if="item.data_devolucao == null">
                            <v-tooltip v-if="item.data_previsao <= dataAtual" top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon class="mr-2" color="#D7CF36" v-bind="attrs" v-on="on">
                                        mdi-alert
                                    </v-icon>
                                </template>
                                <span>Devolução Pendente</span>
                            </v-tooltip>
                        </div>
                        <div v-else>
                            {{ item.data_devolucao }}
                        </div>
                    </template>

                    <template v-slot:[`item.acoes`]="{ item }">
                        <v-tooltip v-if="item.data_devolucao == null" top color="red">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon class="mr-2" color="red" @click="deleteItem(item)" v-bind="attrs" v-on="on">
                                    mdi-close-circle-outline
                                </v-icon>
                            </template>
                            <span>Cancelar Aluguel</span>
                        </v-tooltip>
                        <v-tooltip v-if="item.data_devolucao == null" top color="primary">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon class="mr-2" color="primary" @click="editItem(item)" v-bind="attrs" v-on="on">
                                    mdi-book-check
                                </v-icon>
                            </template>
                            <span>Devolver</span>
                        </v-tooltip>
                    </template>
                </v-data-table>
            </v-col>
            <Footer />
        </v-app>
    </div>
</template>

<script>
import Livro from '../services/livros';
import Usuario from '../services/usuarios';
import Aluguel from '../services/alugueis';
// import Footer from '../components/Footer.vue';

export default {
    name: 'Alugueis',

    components: {
        Footer
    },

    data() {
        return {
            isLoading: true,
            aluguel: {
                id: '',
                livro_id: {
                    id: '',
                    nome: '',
                    editora: {
                        id: '',
                        nome: '',
                        cidade: ''
                    }
                },
                usuario_id: {
                    id: '',
                    nome: '',
                    endereco: '',
                    cidade: '',
                    email: ''
                },
                data_aluguel: '',
                data_previsao: '',
                data_devolucao: ''
            },
            alugueis: [],
            usuarios: [],
            livros: [],
            disponiveis: [],

            valid: true,

            usuarioRules: [v => (v && v.nome != null) || 'Selecione um Usuário!'],
            livroRules: [v => (v && v.nome != null) || 'Selecione um livro!'],
            data_aluguelRules: [v => !!v || 'Campo data de aluguel é obrigatório!'],
            data_previsaoRules: [
                v => !!v || 'Campo data de previsao é obrigatório!',
                v => (v && v >= this.editedItem.data_aluguel) || 'Data de previsão não pode ser menor que a de aluguel!'
            ],
            data_devolucaoRules: [
                v => !!v || 'Campo data de previsao é obrigatório!',
                v =>
                    (v && v >= this.editedItem.data_aluguel) || 'Data de devolução não pode ser menor que a de aluguel!'
            ],

            dialog: false,
            dialogDelete: false,
            search: '',
            headers: [
                { text: 'Cód.', value: 'id' },
                { text: 'Usuário', value: 'usuario_id.nome' },
                { text: 'Livro', value: 'livro_id.nome' },
                { text: 'Data de aluguel', value: 'data_aluguel' },
                { text: 'Data de previsão', value: 'data_previsao' },
                { text: 'Data de devolução', value: 'data_devolucao' },
                { text: 'Status', value: 'status', align: 'center' },
                { text: 'Ações', value: 'acoes', sortable: false, align: 'center' }
            ],
            editedIndex: -1,
            editedItem: {
                id: '',
                livro_id: {
                    id: '',
                    nome: null,
                    editora: {
                        id: '',
                        nome: '',
                        cidade: ''
                    }
                },
                usuario_id: {
                    id: '',
                    nome: null,
                    endereco: '',
                    cidade: '',
                    email: ''
                },

                data_aluguel: '',
                data_previsao: '',
                data_devolucao: ''
            },

            date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
            date1: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
            date2: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
            menu1: false,
            menu2: false,
            menu3: false,

            nowDate: new Date().toISOString().slice(0, 10),
            dataAtual: ''
        };
    },

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Novo Aluguel' : 'Devolver Livro';
        },
        saveEdit() {
            return this.editedIndex === -1 ? 'Salvar' : 'Devolver';
        },
        computedDateFormatted() {
            return this.formatDate(this.date);
        }
    },

    watch: {
        dialog(val) {
            val || this.close();
        },
        dialogDelete(val) {
            val || this.closeDelete();
        },

        date(val) {
            this.editedItem.data_aluguel = this.formatDate(this.date);
        },
        date1(val) {
            this.editedItem.data_previsao = this.formatDate(this.date1);
        },
        date2(val) {
            this.editedItem.data_devolucao = this.formatDate(this.date2);
        }
    },

    mounted() {
        this.listar();
        this.getUsuarios();
        this.getLivros();
        this.livrosDisponiveis();
        this.pegarDataAtual();
    },

    methods: {
        listar() {
            Aluguel.listar().then(resposta => {
                this.isLoading = false;
                this.alugueis = resposta.data;
            });
        },

        pegarDataAtual() {
            var data = new Date();
            var dia = String(data.getDate()).padStart(2, '0');
            var mes = String(data.getMonth() + 1).padStart(2, '0');
            var ano = data.getFullYear();
            var dataAtual = ano + '-' + mes + '-' + dia;
            this.dataAtual = dataAtual;
            console.log(dataAtual);
        },

        livrosDisponiveis() {
            Livro.disponiveis().then(resposta => {
                this.disponiveis = resposta.data;
            });
        },

        getUsuarios() {
            Usuario.listar().then(resposta => {
                this.usuarios = resposta.data;
            });
        },

        getLivros() {
            Livro.listar().then(resposta => {
                this.livros = resposta.data;
            });
        },

        editItem(item) {
            this.editedIndex = this.alugueis.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialog = true;
            this.$refs.form.resetValidation();
        },

        deleteItem(item) {
            this.$swal({
                title: 'Tem certeza?',
                text: 'Este aluguel será cancelado e excluido do sistema!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#198754',
                cancelButtonColor: '#d33',
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancelar'
            }).then(result => {
                if (result.isConfirmed) {
                    this.editedIndex = this.alugueis.indexOf(item);
                    this.editedItem = Object.assign({}, item);

                    var del = {
                        id: this.editedItem.id,
                        usuario_id: this.editedItem.usuario_id,
                        livro_id: this.editedItem.livro_id,
                        data_aluguel: this.editedItem.data_aluguel,
                        data_previsao: this.editedItem.data_previsao,
                        data_devolucao: this.editedItem.data_devolucao
                    };
                    Aluguel.deletar(del).then(resposta => {
                        this.$swal({
                            text: 'Aluguel cancelado com sucesso.',
                            icon: 'success',
                            confirmButtonColor: '#198754',
                            confirmButtonText: 'Ok'
                        });

                        if (resposta != null) {
                            this.listar();
                        }
                    });
                    this.reset();
                    this.close();
                }
            });
            this.editedIndex = -1;
        },

        close() {
            this.dialog = false;

            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
            });
            this.$refs.form.resetValidation();
        },

        closeDelete() {
            this.dialogDelete = false;
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
            });
        },

        reset() {
            this.$refs.form.reset();
        },

        save() {
            if (this.$refs.form.validate()) {
                if (this.editedIndex > -1) {
                    var edit = {
                        id: this.editedItem.id,
                        usuario_id: this.editedItem.usuario_id,
                        livro_id: this.editedItem.livro_id,
                        data_aluguel: this.editedItem.data_aluguel,
                        data_previsao: this.editedItem.data_previsao,
                        data_devolucao: this.editedItem.data_devolucao
                    };
                    Aluguel.alterar(edit).then(resposta => {
                        if (resposta != null) {
                            Toast.fire('Aluguel alterado com sucesso!', '', 'success');
                            this.listar();
                            this.livrosDisponiveis();
                            this.close();
                        }
                    });
                } else {
                    var save = {
                        usuario_id: this.editedItem.usuario_id,
                        livro_id: this.editedItem.livro_id,
                        data_aluguel: this.editedItem.data_aluguel,
                        data_previsao: this.editedItem.data_previsao,
                        data_devolucao: this.editedItem.data_devolucao
                    };
                    Aluguel.salvar(save)
                        .then(resposta => {
                            if (resposta != null) {
                                Toast.fire('Aluguel salvo com sucesso!', '', 'success');
                                this.listar();
                                this.livrosDisponiveis();
                                this.close();
                            }
                        })
                        .catch(resposta => {
                            if (resposta) {
                                var erro = resposta.response.data.error;
                                this.$swal({
                                    icon: 'error',
                                    text: erro,
                                    confirmButtonColor: '#198754',
                                    confirmButtonText: 'Ok'
                                });
                            }
                        });
                }
            }
        },

        formatDate(date) {
            if (!date) return null;

            const [year, month, day] = date.split('-');
            return `${year}-${month}-${day}`;
        },
        parseDate(date) {
            if (!date) return null;

            const [month, day, year] = date.split('/');
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        },
        reseteForm() {
            this.editedItem = {
                id: '',
                livro_id: {
                    id: '',
                    nome: null,
                    editora: {
                        id: '',
                        nome: '',
                        cidade: ''
                    }
                },
                usuario_id: {
                    id: '',
                    nome: null,
                    endereco: '',
                    cidade: '',
                    email: ''
                },

                data_aluguel: '',
                data_previsao: '',
                data_devolucao: ''
            };
            this.reset();
        }
    }
};
</script>

<style>
html,
body {
    height: 100%;
}

#editoras {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.conteudo {
    flex-grow: 1;
}

.icone-menu {
    margin-top: -5px;
    margin-right: 3px;
}

.navbar {
    padding: 5px;
}
</style>