import React, { useState, useEffect } from 'react'

import { getLast12 } from '../Util/Data.js'
import { formatPercentage } from '../Util/Helpers.js'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField} from '@mui/material';

import './MyInflationComponentStyle.css'

function MyInflationComponent(props) {
  const last12 = getLast12();
  const [customWeights, setCustomWeights] = useState(last12['PesoMensal']);
  const [debouncedCustomWeights, setDebouncedCustomWeights] = useState(last12['PesoMensal'])

  const descMap = {
    "7170":"alimentação dentro e fora do domicílio",
    "7445":"aluguel, manutenção, limpeza, gás, energia, água",
    "7486":"móveis e eletrônicos",
    "7558":"roupas, calçados e jóias",
    "7625":"transporte público, veículo próprio e combustível",
    "7660":"saúde, remédios e higiene",
    "7712":"lazer e estética",
    "7766":"escola, cursos e livros",
    "7786":"telefonia e internet"
  }
  const calculateTotal = () => {
    let ipcaSum = 0
    let pesoSum = 0
    Object.keys(last12['PesoMensal']).map((key) => {
      ipcaSum += debouncedCustomWeights[key]*last12['Inflacao12Meses'][key]/100
      pesoSum += debouncedCustomWeights[key]
      return 0
    })

    return {
      ipca: ipcaSum,
      weights: pesoSum
    }
  }

  const [totals, setTotals] = useState(calculateTotal());
  const handleWeightChange = (event, key) => {
    setCustomWeights({
      ...customWeights, 
      [key]: event.target.value === '' ? parseFloat(last12['PesoMensal'][key]) : parseFloat(event.target.value)
      })
  }

  useEffect(() => {
    setTotals(calculateTotal())
  }, [debouncedCustomWeights]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedCustomWeights(customWeights);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [customWeights]);

  return (
    <div className="panelContainer">
      <h2> Calculadora personalizada da inflação </h2>
      <TableContainer >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Componente</TableCell>
                <TableCell>Peso no seu consumo (A) </TableCell>
                <TableCell>Aumento nos últimos 12 meses (B) </TableCell>
                <TableCell>Resultado (A × B)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(last12['PesoMensal']).map((key) => (
                <TableRow
                  key={key}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {last12['DescItem'][key]+' ('+descMap[key]+')'}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <TextField 
                      id="outlined-basic" 
                      label={formatPercentage(last12['PesoMensal'][key])} 
                      variant="outlined"
                      onChange={(e) => handleWeightChange(e, key)} />
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {formatPercentage(last12['Inflacao12Meses'][key])}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {formatPercentage(last12['Inflacao12Meses'][key]*debouncedCustomWeights[key]/100)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>Total</TableCell>
                <TableCell>{formatPercentage(totals['weights'])}</TableCell>
                <TableCell></TableCell>
                <TableCell>{formatPercentage(totals['ipca'])}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
    </div>
  );
}

export default MyInflationComponent;
