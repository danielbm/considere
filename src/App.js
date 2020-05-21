import React from 'react'
import './App.css'
import PanelComponent from './Components/PanelComponent.js'

function App() {

  return (
    <div className="App">
      <div className="header"> CONSIDERE A INFLAÇÃO </div>
      <PanelComponent
        type="dolar"
        format="currency"
        title="Cotação do Dólar"
      />
      <PanelComponent
        type="ibov"
        format="number"
        title="IBOVESPA"
      />
      <PanelComponent
        type="minimo"
        format="currency"
        title="Salário Mínimo"
      />
      <PanelComponent
        type="onibus"
        format="currency"
        title="Passagem de ônibus em São Paulo"
      />
      <PanelComponent
        type="fipezap"
        format="number"
        title="Valorização imobiliária (FIPEZAP)"
      />
      <PanelComponent
        type="juros"
        format="percentage"
        title="Juros (Taxa SELIC)"
      />
      <PanelComponent
        type="stf"
        format="currency"
        title="Salário dos ministros do STF"
      />
    </div>
  );
}

export default App;
