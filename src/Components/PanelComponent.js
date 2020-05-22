import React, { useState, useEffect } from 'react'
import PulseLoader from 'react-spinners/PulseLoader'
import { getCurrent, getHist } from '../Util/Data.js'
import { maxArray, minArray, getMonthYear, formatNumber } from '../Util/Helpers.js'
import ChartComponent from './ChartComponent.js'
import './PanelComponentStyle.css'

function PanelComponent(props) {
  let { type, format, title, obs} = props

  const [currentType, setCurrentType] = useState(0)
  const [typeSeries, setTypeSeries] = useState(null)
  let maxType = typeSeries ? maxArray(typeSeries) : 0
  let minType = typeSeries ? minArray(typeSeries) : 0

  useEffect(() => {
    setCurrentType(getCurrent(type+'_a'))
    setTypeSeries(getHist(type+'_a'))
  }, []);

  return (
    <div className="panelContainer">
      <h2> {title} </h2>
      <p> Última posição ({typeSeries && getMonthYear(typeSeries[0][typeSeries[0].length-1])}): { currentType !== 0 && formatNumber(currentType, format)} </p>
      <p> Máxima histórica: {maxType !== 0 && formatNumber(maxType[1], format)+" em "+getMonthYear(maxType[0])}</p>
      <p> Mínima histórica: {minType !== 0 && formatNumber(minType[1], format)+" em "+getMonthYear(minType[0])}</p>
      {typeSeries ? <ChartComponent
        title=""
        xTitle=""
        yTitle="Valor ajustado"
        lineTitle="Valor no mês"
        ySeries={typeSeries[1]}
        xSeries={typeSeries[0]}
        format={format}
      /> : <PulseLoader />}
      <div className="obs"> Fonte: {obs} </div>
    </div>
  );
}

export default PanelComponent;
