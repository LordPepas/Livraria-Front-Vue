<template>
  <v-app>
    <v-divider color="white" class="mt-1" dark></v-divider>
    <v-container class="dash">
      <v-row>
        <v-col cols="12" sm="12" class="mt-8">
          <v-row class="px-5 mt-n6 ml-5">
            <v-col cols="12" sm="3" v-for="list in lists" :key="list.title">
              <v-card
                align="center"
                color="#f9faf"
                class="rounded-circle border pt-10"
                width="150"
                height="150"
                flat
              >
                <v-icon size="40" color="indigo darken-3">{{
                  list.icon
                }}</v-icon>
                <v-card-text class="grey--text text-lg-h7">{{
                  list.title
                }}</v-card-text>
                <v-btn
                  absolute
                  color="indigo darken-3"
                  class="white--text"
                  fab
                  left
                  top="50%"
                  transform="translateY(-50%)"
                >
                  {{ list.count }}
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
          <v-row class="mt-n5">
            <v-col cols="12" sm="6">
              <div class="mt-7">
                <LineChart />
              </div>
            </v-col>
            <v-col cols="12" sm="6">
              <v-card class="mt-7 card" style="width: 100%;" elevation="3">
                <v-card-title class="centro">
                  <v-icon>mdi-book</v-icon>
                  Último livro alugado:
                </v-card-title>
                <v-card-content class="centro"></v-card-content>
              </v-card>
              <div class="mt-7">
                <PieChart />
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import PieChart from "../components/chart/PieChart.vue";
import LineChart from "../components/chart/LineChart.vue";

export default {
  name: "DashboardView",
  data: () => ({
    lists: [
      {
        icon: "mdi-account-group",
        title: "Clientes",
        count: 21,
      },
      {
        icon: "mdi-domain",
        title: "Editoras",
        count: 21,
      },
      {
        icon: "mdi-book-multiple",
        title: "Livros",
        count: 34,
      },
      {
        icon: "mdi-calendar-text-outline",
        title: "Aluguéis",
        count: 31,
      },
    ],
  }),

  components: {
    LineChart,
    PieChart,
  },
};
</script>

<style scoped>
.border {
  border: 2px solid #2e8faf !important;
}

.v-btn--fab.v-size--default.v-btn--absolute.v-btn--top {
  top: 65px !important;
}

.v-btn--absolute.v-btn--left,
.v-btn--fixed.v-btn--left {
  left: -28px !important;
}

.card {
  height: 120px;
  border: 1px solid;
}

.centro {
  display: flex;
  text-align: center;
  justify-content: center;
}

.dash {
  border: 1px solid #eeee;
  border-radius: 3px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
}
</style>
