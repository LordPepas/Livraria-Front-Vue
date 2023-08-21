<template>
  <v-flex>
    <div class="chart_container">
      <div class="title text-center">Livros mais alugados</div>
      <canvas ref="myChart" width="400" height="400"></canvas>
    </div>
  </v-flex>
</template>

<script>
import Chart from "chart.js/auto";
import Rentals from "@/services/Rentals";

export default {
  data() {
    return {
      topThreeBooks: [],
    };
  },
  mounted() {
    this.fetchTopThreeBooks();
  },
  methods: {
    async fetchTopThreeBooks() {
      try {
        const rentals = await Rentals.read();

        const bookCount = {};
        rentals.data.forEach((rental) => {
          const livro_id = rental.livro_id.nome;
          if (bookCount[livro_id]) {
            bookCount[livro_id]++;
          } else {
            bookCount[livro_id] = 1;
          }
        });

        const bookCountArray = Object.entries(bookCount);

        bookCountArray.sort((a, b) => b[1] - a[1]);

        this.topThreeBooks = bookCountArray.slice(0, 3);

        this.renderPieChart();
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    },
    renderPieChart() {
      if (!this.topThreeBooks) return;

      const labels = this.topThreeBooks.map((item) => item[0]);
      const data = this.topThreeBooks.map((item) => item[1]);
      console.log(labels);
      const ctx = this.$refs.myChart.getContext("2d");
      new Chart(ctx, {
        type: "bar",
        options: {
          indexAxis: "x",
          scales: {
            x: {
              display: false, // Remove o eixo X
            },
            y: {
              beginAtZero: true,
            },
          },
        },
        data: {
          labels: labels,
          datasets: [
            {
              axis: "y",
              label: "Livros Alugados",
              data: data,
              fill: false,
              backgroundColor: [
                "rgb(75, 192, 192)",
                "rgb(255, 99, 132)",
                "rgba(255, 159, 64)",
              ],
              borderColor: [
                "rgb(75, 192, 192)",
                "rgb(255, 99, 132)",
                "rgba(255, 159, 64)",
              ],
              borderWidth: 1,
            },
          ],
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      });
    },
  },
};
</script>
