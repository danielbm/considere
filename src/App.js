import React from 'react'
import './App.css'
import PanelComponent from './Components/PanelComponent.js'

function App() {

  return (
    <div className="App">
      <div className="header">
        <h1> CONSIDERE A INFLAÇÃO </h1>
        <p> Envie este site sempre que alguém estiver comparando preços sem reajustar pela inflação.</p>
        <p> Todos os valores abaixo estão corrigidos para o valor atual da moeda. </p>
      </div>
      <PanelComponent
        type="dolar"
        format="currency"
        title="Cotação do Dólar"
        obs="http://ipeadata.gov.br/exibeserie.aspx?serid=38389"
      />
      <PanelComponent
        type="ibov"
        format="number"
        title="IBOVESPA"
        obs="B3"
      />
      <PanelComponent
        type="juros"
        format="percentage"
        title="Juros (Taxa SELIC)"
        obs="http://www.ipeadata.gov.br/ExibeSerie.aspx?serid=38402"
      />
      <PanelComponent
        type="minimo"
        format="currency"
        title="Salário Mínimo"
        obs="http://www.ipeadata.gov.br/ExibeSerie.aspx?stub=1&serid1739471028=1739471028"
      />
      <PanelComponent
        type="onibus"
        format="currency"
        title="Passagem de ônibus em São Paulo"
        obs="http://www.sptrans.com.br/sptrans/tarifas/"
      />
      <PanelComponent
        type="gasolina"
        format="currency"
        title="Preço do litro de gasolina"
        obs="http://www.anp.gov.br/precos-e-defesa-da-concorrencia/precos/levantamento-de-precos/serie-historica-do-levantamento-de-precos-e-de-margens-de-comercializacao-de-combustiveis"
      />
      <PanelComponent
        type="fipezap"
        format="number"
        title="Valorização imobiliária (FIPEZAP)"
        obs="https://www.fipe.org.br/pt-br/indices/fipezap/#fipezap-historico"
      />
      <PanelComponent
        type="passagem"
        format="currency"
        title="Preço médio da passagem aérea doméstica"
        obs="https://www.anac.gov.br/assuntos/setor-regulado/empresas/envio-de-informacoes/tarifas-aereas-domesticas-1/relatorio-de-tarifas-aereas-domesticas-nacional"
      />
      <PanelComponent
        type="plano"
        format="currency"
        title="Preço médio do plano de saúde"
        obs="https://sidra.ibge.gov.br/pesquisa/snipc"
      />
      <PanelComponent
        type="stf"
        format="currency"
        title="Salário dos ministros do STF"
        obs="http://qualidade.ieprev.com.br/UserFiles/File/tabela%20do%20subsidios%20dos%20ministros%202015(2).pdf"
      />
      <PanelComponent
        type="bigmac"
        format="currency"
        title="Preço do Big Mac"
        obs="https://www.quandl.com/data/ECONOMIST/BIGMAC_BRA-Big-Mac-Index-Brazil"
      />

    </div>
  );
}

export default App;
