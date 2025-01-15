import React from "react"
import Chart from 'react-apexcharts'
import { formatNumber } from '../Util/Helpers.js'
import useMediaQuery from '@mui/material/useMediaQuery';
import './MultiChartComponentStyle.css'

const generateOptions = (title, xTitle, yTitle, ySeries, xSeries, format) => {
  let options = {
    options: {
      chart: {
        shadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 1
        },
        toolbar: {
          show: false
        }
      },
      tooltip: {
        x: {
          format: 'MMM / yy'
        }
      },
      defaultLocale: 'pt',
      locales: [{
        name: 'pt',
        options: {
          shortMonths: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
          toolbar: {
            download: 'Download',
            selection: 'Selecionar',
            selectionZoom: 'Selecionar Zoom',
            zoomIn: 'Mais Zoom',
            zoomOut: 'Menos Zoom',
            pan: 'Arrastar',
            reset: 'Resetar',
          }
        }
      }],
      // colors: ['#77B6EA', '#545454'],
      colors: ['#008FFB','#00E396','#775DD0','#FEB019','#FF4560', '#4caf50', '#546E7A', '#c7f464', '#2b908f'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 1.5,
      },
      grid: {
        borderColor: '#e7e7e7',
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      markers: {
        size: 0
      },
      title: {
        text: title,
        align: 'left'
      },
      xaxis: {
        type: 'datetime',
        categories: xSeries,
        title: {
          text: xTitle
        }
      },
      yaxis: {
        forceNiceScale: true,
        title: {
          text: yTitle
        },
        labels: {
          formatter: (value) => { return formatNumber(value, format) },
        }
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'left',
        // floating: true,
        // offsetY: -25,
        // offsetX: -5
      }
    },
    series: ySeries
  }

  return options
}

function MultiChartComponent(props) {
  const isMobile = useMediaQuery('(max-width:600px)');

  let { title, xTitle, yTitle, ySeries, xSeries, format } = props

  const series = generateOptions(title, xTitle, yTitle, ySeries, xSeries, format)

  return (
    <div>
      <Chart
        options={series.options}
        series={series.series}
        type="line"
        // width="400px"
        width={isMobile ? "300px" : "600px"}
        height={isMobile ? '400px' : 'auto' }
      />
    </div>
  );
}

export default MultiChartComponent;
