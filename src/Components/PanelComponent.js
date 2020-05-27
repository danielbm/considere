import React, { useState, useEffect } from 'react'
import PulseLoader from 'react-spinners/PulseLoader'
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import {
  EmailIcon,
  FacebookIcon,
  LinkedinIcon,
  RedditIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import { getCurrent, getHist } from '../Util/Data.js'
import { maxArray, minArray, getMonthYear, formatNumber } from '../Util/Helpers.js'
import ChartComponent from './ChartComponent.js'
import './PanelComponentStyle.css'

function PanelComponent(props) {
  let { type, format, title, src, obs} = props

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
      <div className="share">
        <p className="shareText"> Compartilhar: </p>
        <EmailShareButton url={"https://www.considereainflacao.com.br/#"+type} subject={"Considere a Inflação"} >
          <EmailIcon size={25} round={true} />
        </EmailShareButton>
        <WhatsappShareButton url={"https://www.considereainflacao.com.br/#"+type}>
          <WhatsappIcon size={25} round={true} />
        </WhatsappShareButton>
        <FacebookShareButton url={"https://www.considereainflacao.com.br/#"+type}>
          <FacebookIcon size={25} round={true} />
        </FacebookShareButton>
        <TwitterShareButton url={"https://www.considereainflacao.com.br/#"+type}>
          <TwitterIcon size={25} round={true} />
        </TwitterShareButton>
        <LinkedinShareButton url={"https://www.considereainflacao.com.br/#"+type}>
          <LinkedinIcon size={25} round={true} />
        </LinkedinShareButton>
        <RedditShareButton url={"https://www.considereainflacao.com.br/#"+type}>
          <RedditIcon size={25} round={true} />
        </RedditShareButton>
      </div>
      <h2> {title} </h2>
      <p> Última posição ({typeSeries && getMonthYear(typeSeries[0][typeSeries[0].length-1])}): { currentType !== 0 && formatNumber(currentType, format)} </p>
      <p> Máxima histórica: {maxType !== 0 && formatNumber(maxType[1], format)+" em "+getMonthYear(maxType[0])}</p>
      <p> Mínima histórica: {minType !== 0 && formatNumber(minType[1], format)+" em "+getMonthYear(minType[0])}</p>
      { obs && (<div className="obs"> Obs: {obs} </div>) }
      {typeSeries ? <ChartComponent
        title=""
        xTitle=""
        yTitle="Valor ajustado"
        lineTitle="Valor no mês"
        ySeries={typeSeries[1]}
        xSeries={typeSeries[0]}
        format={format}
      /> : <PulseLoader />}
      <div className="obs"> Fonte: {src} </div>
    </div>
  );
}

export default PanelComponent;
