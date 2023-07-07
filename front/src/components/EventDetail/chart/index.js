import { Bar } from 'react-chartjs-2';
import { CategoryScale } from 'chart.js'; 
import Chart from 'chart.js/auto';


const BarChart = ({ optionsList }) => {
  

  Chart.register(CategoryScale);

  const data =  {
    labels: optionsList.map((option) => (option.datetime)),
    datasets: [{
      label: '# de votos',
      data: optionsList.map((option) => (option.votes)),
      borderWidth: 1
    }]
  };

  const config = {
    scales: {
      y: {
          suggestedMin: 0,
          suggestedMax: 10,
      }
   },
  };

  return (
    <div>
      <h2>Opciones</h2>
      <Bar data={data} style={{height:'100%'}} options={config} />
    </div>
  );
};

export default BarChart;
