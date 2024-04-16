import React, { useEffect, useState } from 'react'
import './WeightComponentStyle.css'
import useMediaQuery from '@mui/material/useMediaQuery';
import { InputLabel, Button, Select } from '@mui/material'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';

let yearMo = []
const currYear = new Date().getFullYear()
for (let i = 2000; i <= currYear; i++) {
  yearMo.push(i.toString());
}

const apiUrl = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';

function WeightComponent(props) {

  const isMobile = useMediaQuery('(max-width:600px)', { noSsr: true });

  const [response, setResponse] = useState({})
  const [selectedCut, setSelectedCut] = useState('2000');


  const fetchWeight = async () => {
    const yearMo = selectedCut+"01"

    const size = isMobile ? 'mobile' : 'desktop'
    const res = await fetch(apiUrl+'/weighted'+'?cut='+yearMo+'&size='+size, { mode: 'cors' });
    if (res.staus === 204) {
      alert('Nenhum dado para a seleção escolhida')
    }
    const response = await res.json();
    setResponse(response);
  };

  useEffect(() => {
    fetchWeight();
  }, []);


  const handleYearMoChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedCut(value);
  };
  
  return (
    <div className="container">
      <h2> Pesquisa por componente da inflação </h2>
      <div className="cutContainer">
        <InputLabel className="cutLabel">Data de corte: </InputLabel>
        <Select
          native
          value={selectedCut}
          onChange={handleYearMoChange}
          className="cutInput"
        >
          {yearMo.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </Select>
      </div>
      
      <div className="buttonsContainer">
        <Button sx={{ marginRight: 1 }} color="custom" variant="contained" className="button" onClick={() => fetchWeight()} >
          Gerar gráfico
        </Button>
      </div>
      <div>
        <TableContainer >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Componente</TableCell>
                <TableCell>Participação no IPCA total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(response).map((key) => (
                <TableRow
                  key={key}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {key}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {response[key].toFixed(2) + "%"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default WeightComponent;
