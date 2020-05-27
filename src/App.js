import React from 'react'
import ScrollableAnchor from 'react-scrollable-anchor'
import './App.css'
import PanelComponent from './Components/PanelComponent.js'


const generatePanel = (type, format, title, src, obs) => {
  return (
    <ScrollableAnchor id={type}>
      <div>
        <PanelComponent
          type={type}
          format={format}
          title={title}
          src={src}
          obs={obs}
        />
      </div>
    </ScrollableAnchor>
  )
}
function App() {

  return (
    <div className="App">
      <div className="header">
        <h1> CONSIDERE A INFLAÇÃO </h1>
        <p> Envie este site sempre que alguém estiver comparando preços sem reajustar pela inflação.</p>
        <p> Todos os valores abaixo estão corrigidos para o valor atual da moeda. </p>
      </div>
      {generatePanel("dolar", "currency", "Cotação do Dólar", "http://ipeadata.gov.br/exibeserie.aspx?serid=38389 e https://fred.stlouisfed.org/series/CPIAUCSL", "Ajustado pela inflação brasileira e americana")}
      {generatePanel("ibov", "number", "IBOVESPA", "B3")}
      {generatePanel("minimo", "currency", "Salário Mínimo", "http://www.ipeadata.gov.br/ExibeSerie.aspx?stub=1&serid1739471028=1739471028")}
      {generatePanel("onibus", "currency", "Passagem de ônibus em São Paulo", "B3")}
      {generatePanel("gasolina", "currency", "Preço do litro de gasolina", "http://www.anp.gov.br/precos-e-defesa-da-concorrencia/precos/levantamento-de-precos/serie-historica-do-levantamento-de-precos-e-de-margens-de-comercializacao-de-combustiveis")}
      {generatePanel("fipezap", "number", "Valorização imobiliária (FIPEZAP)", "https://www.fipe.org.br/pt-br/indices/fipezap/#fipezap-historico")}
      {generatePanel("aluguelsp", "number", "Aluguéis em São Paulo (FIPEZAP)", "http://www.ipeadata.gov.br/Default.aspx")}
      {generatePanel("passagem", "currency", "Preço médio da passagem aérea doméstica", "https://www.anac.gov.br/assuntos/setor-regulado/empresas/envio-de-informacoes/tarifas-aereas-domesticas-1/relatorio-de-tarifas-aereas-domesticas-nacional")}
      {generatePanel("plano", "currency", "Preço médio do plano de saúde", "https://sidra.ibge.gov.br/pesquisa/snipc")}
      {generatePanel("stf", "currency", "Salário dos ministros do STF", "http://qualidade.ieprev.com.br/UserFiles/File/tabela%20do%20subsidios%20dos%20ministros%202015(2).pdf")}
      {generatePanel("bigmac", "currency", "Preço do Big Mac", "https://www.quandl.com/data/ECONOMIST/BIGMAC_BRA-Big-Mac-Index-Brazil")}
      {generatePanel("gold", "currency", "Preço do ouro (oz)", "https://www.indexmundi.com/pt/pre%C3%A7os-de-mercado/?mercadoria=ouro&meses=240&moeda=brl")}
      {generatePanel("ipca", "percentage", "IPCA mensal", "http://www.ipeadata.gov.br/Default.aspx", "IPCA não está ajustado, por ser a própria inflação")}
      {generatePanel("juros", "percentage", "Juros real (Taxa SELIC)", "http://www.ipeadata.gov.br/ExibeSerie.aspx?serid=38402", "Valores apenas descontando a inflação do mês")}

      <div className="footer">
        <p> Dúvidas, sugestões e contribuições em: <a href="https://github.com/danielbm/considere">https://github.com/danielbm/considere</a> </p>
      </div>
    </div>
  );
}

export default App;
