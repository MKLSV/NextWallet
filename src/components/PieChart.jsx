import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);
// // ChartJS.defaults.font.size = 50;

export function PieChart({ spendsCount, incomesCount }) {
  const data = {
    // labels: ['Доходы', 'Расходы'],
    datasets: [
      {
        data: [spendsCount, incomesCount],
        backgroundColor: [
          '#ff5c61',
          '#0cc9cb',
        ],
        borderColor: [
          '#ff5c61',
          '#0cc9cb',
        ],
        hoverBackgroundColor: ['darkred', 'darkblue', 'darkyellow'],
        shadowColor: 'rgba(0, 0, 0, 0.4)',
        shadowBlur: 110,
        shadowOffsetX: 115,
        shadowOffsetY: 115,
        hoverOffset: 4
      },
    ],
  };




  return (
    <div className="chart-container">
      <div className="chart">
        <div className="shadow"></div>
        <div className="dollar-box">
          <div className="dollar-container">
            <div className="dollar">
              <img src='/dollar.png' />
            </div>
          </div>
        </div>
        <Pie data={data} className='pie-chart' />
      </div>
    </div>

  )
}
