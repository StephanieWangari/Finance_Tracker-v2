import { Pie } from "react-chartjs-2";

function Chart({ transactions }) {
  const expenses = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const income = transactions
    .filter(t => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const data = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        data: [income, expenses],
        backgroundColor: ["green", "red"]
      }
    ]
  };

  return <Pie data={data} />;
}

export default Chart;
