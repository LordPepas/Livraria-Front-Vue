<template>
  <v-flex>
    <div class="chart_container">
      <div class="title text-center">Livros disponíveis</div>
      <canvas ref="myPieChart" width="470" height="230"></canvas>
    </div>
  </v-flex>
</template>

<script>
import { Chart } from "chart.js";
import { PieController, CategoryScale } from "chart.js";

export default {
  mounted() {
    CategoryScale.register();
    PieController.register();

    this.initChart();
  },
  methods: {
    initChart() {
      const ctx = this.$refs.myPieChart.getContext("2d");
      new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["Livro1", "Livro2", "Livro3", "Livro4", "Livro5"],
          datasets: [
            {
              label: "# Livro1",
              data: [15, 10, 5, 3, 2],
              backgroundColor: [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(255, 206, 86)",
                "rgb(75, 192, 192)",
                "rgb(153, 102, 255)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 0,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },
  },
};
</script>

<style scoped>
.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.chart_container {
  text-align: center;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}
</style>
