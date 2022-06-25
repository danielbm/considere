import React, { useEffect, useState } from 'react'
import './IBGEComponentStyle.css'
import useMediaQuery from '@mui/material/useMediaQuery';
import { List, ListItem, Checkbox, Radio, ListItemText, Button } from '@mui/material'
import DeselectIcon from '@mui/icons-material/Deselect';
import categories from '../Util/categories.js'
import FileSaver from 'file-saver'
import PulseLoader from 'react-spinners/PulseLoader'

let yearMo = ['08/1999','09/1999','10/1999','11/1999','12/1999']
const months = ['01','02','03','04','05','06','07','08','09','10','11','12']
const currYear = new Date().getFullYear()
const currMonth = new Date().getMonth() - 1
for (let i = 2000; i <= currYear; i++) {
  for (const j of months) {
    if (i !== currYear || parseInt(j) <= currMonth ) {
      yearMo.push(j+'/'+i);
    }  
  }
}

function IBGEComponent(props) {

  const isMobile = useMediaQuery('(max-width:600px)');

  const [img, setImg] = useState(null);
  const [checked, setChecked] = useState({0: true});
  const [cut, setCut] = useState('08/1999');

  const fetchImage = async (type) => {
    let items = Object.keys(checked).map((index) => {
      return categories[index][0]
    })
    const yearMo = cut.slice(3,7)+cut.slice(0,2)

    const size = isMobile ? 'mobile' : 'desktop'
    const res = await fetch('/'+type+'?items='+items.join(',')+'&cut='+yearMo+'&type=real&size='+size, { mode: 'cors' });
    if (res.staus === 204) {
      alert('Nenhum dado para a seleção escolhida')
    }
    if (type === 'graph') {
      const imageBlob = await res.blob();
      const imageObjectURL = URL.createObjectURL(imageBlob);
      setImg(imageObjectURL);
    } else if (type === 'csv') {
      const csvBlob = await res.blob();
      FileSaver.saveAs(csvBlob, "dados.csv");
    }
  };

  useEffect(() => {
    fetchImage('graph');
  }, []);

  const handleItemChange = (event, index) => {
    let updated = {...checked}
    if (index in updated) {
      delete updated[index]
    } else {
      updated[index] = true
    }
    setChecked(updated)
  };

  const renderItem = (index) => {
    const text = categories[index][2] ? ' - até '+categories[index][2] : ''
    return (
      <ListItem key={index}>
        <Checkbox 
          checked={index in checked}
          onChange={(e) => handleItemChange(e, index) } />
        <ListItemText primary={categories[index][1]+text} />
      </ListItem>
    )
  }

  const handleYearMoChange = (event, index) => {
    setCut(yearMo[index])
  };

  const renderYearMo = (index) => {
    return (
      <ListItem key={index}>
        <Radio 
          checked={cut === yearMo[index]}
          onChange={(e) => handleYearMoChange(e, index) } />
        <ListItemText primary={yearMo[index]} />
      </ListItem>
    )
  }

  return (
    <div className="container">
      <h2> Pesquisa por componente da inflação </h2>
      <div className="pickerContainer">
        <List dense={true} className="picker" 
          subheader={<ListItem> Componentes </ListItem>}>
          {categories.map((item, index) => (
              renderItem(index)
            ))}
        </List>
        <List dense={true} className="picker"
          subheader={<ListItem> Data de corte </ListItem>}>
          {yearMo.map((item, index) => (
              renderYearMo(index)
            ))}
        </List>
      </div>
      <Button className="clearButton" color="error" startIcon={<DeselectIcon />} onClick={() => setChecked({})} >
        Limpar seleção
      </Button>
      <div className="buttonsContainer">
        <Button sx={{ marginRight: 1 }} color="custom" variant="contained" className="button" disabled={Object.keys(checked).length > 0 ? false : true} onClick={() => fetchImage('graph')} >
          Gerar gráfico
        </Button>
        <Button sx={{ marginRight: 1 }} color="custom" variant="contained" className="button" disabled={Object.keys(checked).length > 0 ? false : true} onClick={() => fetchImage('csv')} >
          Exportar CSV
        </Button>
      </div>
      { img ? <img src={img} className="imgResults" alt="IBGE chart" width={isMobile ? "350px" : "800px"}/> : <PulseLoader /> }
    </div>
  );
}

export default IBGEComponent;
