import React from "react"
import Chart from 'react-apexcharts'
import { formatNumber } from '../Util/Helpers.js'
import useMediaQuery from '@mui/material/useMediaQuery';
import './ChartComponentStyle.css'

const generateOptions = (title, xTitle, yTitle, line, ySeries, xSeries, format) => {
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
          show: true
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
      colors: ['#77B6EA', '#545454'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth'
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
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5
      }
    },
    series: [
      {
        name: line,
        data: ySeries
      }
    ]
  }

  return options
}

function ChartComponent(props) {
  const isMobile = useMediaQuery('(max-width:600px)');

  let { title, xTitle, yTitle, lineTitle, ySeries, xSeries, format } = props

  const series = generateOptions(title, xTitle, yTitle, lineTitle, ySeries, xSeries, format)

  return (
    <div>
      <Chart
        options={series.options}
        series={series.series}
        type="line"
        // width="400px"
        width={isMobile ? "300px" : "600px"}
      />
    </div>
  );
}

export default ChartComponent;
