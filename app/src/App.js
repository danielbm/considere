import React from 'react'
import ScrollableAnchor from 'react-scrollable-anchor'
import './App.css'
import PanelComponent from './Components/PanelComponent.js'
import IBGEComponent from './Components/IBGEComponent.js'
// import WeightComponent from './Components/WeightComponent.js'
import MyInflationComponent from './Components/MyInflationComponent.js'
import { createTheme, ThemeProvider } from '@mui/material/styles';

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

const theme = createTheme({
  palette: {
    custom: {
      light: '#282c34',
      main: '#282c34',
      dark: 'black',
      contrastText: '#fff',
    }
  },
});

function App() {
  return (
    <div className="App">
      <div className="header">
        <h1> CONSIDERE A INFLAÇÃO </h1>
        <p> Todos os valores abaixo estão corrigidos pelo IPCA. </p>
      </div>
      <ThemeProvider theme={theme}>
        <IBGEComponent />
      </ThemeProvider>
      {/* <ThemeProvider theme={theme}>
        <WeightComponent />
      </ThemeProvider> */}
      {generatePanel("dolar", "currency", "Cotação do Dólar", "http://ipeadata.gov.br/exibeserie.aspx?serid=38389 e https://fred.stlouisfed.org/series/CPIAUCSL", "Ajustado pela inflação brasileira e americana")}
      {generatePanel("ibov", "number", "IBOVESPA", "B3")}
      {generatePanel("minimo", "currency", "Salário Mínimo", "http://www.ipeadata.gov.br/ExibeSerie.aspx?stub=1&serid1739471028=1739471028")}
      {generatePanel("onibus", "currency", "Passagem de ônibus em São Paulo", "http://www.sptrans.com.br/sptrans/tarifas/")}
      {generatePanel("gasolina", "currency", "Preço do litro de gasolina", "https://www.gov.br/anp/pt-br/assuntos/precos-e-defesa-da-concorrencia/precos/levantamento-de-precos-de-combustiveis-ultimas-semanas-pesquisadas")}
      {generatePanel("energia", "currency", "Tarifa média de energia elétrica residencial (R$/MWh)", "https://portalrelatorios.aneel.gov.br/mercado/cativo#!")}
      {generatePanel("cesta", "currency", "Custo da cesta básica", "https://www.dieese.org.br/cesta/")}      
      {generatePanel("fipezap", "number", "Imóveis em São Paulo (FIPEZAP)", "https://www.fipe.org.br/pt-br/indices/fipezap/#fipezap-historico")}
      {generatePanel("aluguelsp", "number", "Aluguéis em São Paulo (FIPEZAP)", "https://www.fipe.org.br/pt-br/indices/fipezap/#fipezap-historico")}
      {generatePanel("passagem", "currency", "Preço médio da passagem aérea doméstica", "https://sistemas.anac.gov.br/sas/downloads/view/frmDownload.aspx")}
      {generatePanel("plano", "currency", "Preço médio do plano de saúde", "https://sidra.ibge.gov.br/pesquisa/snipc")}
      {generatePanel("stf", "currency", "Salário dos ministros do STF", "http://qualidade.ieprev.com.br/UserFiles/File/tabela%20do%20subsidios%20dos%20ministros%202015(2).pdf")}
      {generatePanel("bigmac", "currency", "Preço do Big Mac", "https://truflation.com/marketplace/big-mac-index-brazil")}
      {generatePanel("gold", "currency", "Preço do ouro (oz)", "https://pt.bullion-rates.com/gold/BRL-history.htm")}
      {generatePanel("ipca", "percentage", "IPCA mensal", "http://www.ipeadata.gov.br/ExibeSerie.aspx?serid=36482&module=M", "IPCA não está ajustado, por ser a própria inflação")}
      {generatePanel("ipca12", "percentage", "IPCA acumulado (12 meses)", "http://www.ipeadata.gov.br/ExibeSerie.aspx?serid=36482&module=M", "IPCA não está ajustado, por ser a própria inflação")}
      <ThemeProvider theme={theme}>
        <MyInflationComponent />
      </ThemeProvider>
      <div className="footer">
        <p> Dúvidas, sugestões e contribuições em: <a href="https://github.com/danielbm/considere">https://github.com/danielbm/considere</a> e <a href="https://twitter.com/danielbrasilm1">https://twitter.com/danielbrasilm1</a> </p>
        <p> Conheça também a calculadora de compra ou aluguel de imóvel: <a href="https://www.calculadoraimovel.com.br">https://www.calculadoraimovel.com.br</a> </p>
      </div>
    </div>
  );
}
// {generatePanel("juros", "percentage", "Juros real (Taxa SELIC)", "http://www.ipeadata.gov.br/ExibeSerie.aspx?serid=38402", "Valores apenas descontando a inflação do mês")}
export default App;
