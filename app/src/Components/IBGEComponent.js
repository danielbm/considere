import React, { useEffect, useState } from 'react'
import './IBGEComponentStyle.css'
import useMediaQuery from '@mui/material/useMediaQuery';
import { ListItem, Checkbox, Radio, ListItemText, Button } from '@mui/material'
import DeselectIcon from '@mui/icons-material/Deselect';
import categories from '../Util/categories.js'
import FileSaver from 'file-saver'
import PulseLoader from 'react-spinners/PulseLoader'
import { FixedSizeList, VariableSizeList } from 'react-window';

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

  const isMobile = useMediaQuery('(max-width:600px)', { noSsr: true });

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

  const renderItem = (props) => {
    const index = props.index
    const text = categories[index][2] ? ' - até '+categories[index][2] : ''
    return (
      <ListItem key={index} style={props.style}>
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

  const renderYearMo = (props) => {
    const index = props.index
    return (
      <ListItem key={index} style={props.style}>
        <Radio 
          checked={cut === yearMo[index]}
          onChange={(e) => handleYearMoChange(e, index) } />
        <ListItemText primary={yearMo[index]} />
      </ListItem>
    )
  }

  const getItemSize = (index) => {
    if (!isMobile)
      return 46
    const text = categories[index][1] + (categories[index][2] ? ' - até '+categories[index][2] : '')
    console.log(text.length)
    return 46 + (text.length)/42*54
  }
  return (
    <div className="container">
      <h2> Pesquisa por componente da inflação </h2>
      <div className="pickerContainer">
        <VariableSizeList className="picker"
          height={200}
          itemSize={getItemSize}
          itemCount={categories.length}
          overscanCount={20}>
              {renderItem}
        </VariableSizeList>
        <FixedSizeList className="picker"
          height={200}
          itemSize={40}
          itemCount={yearMo.length}
          overscanCount={10}>
              {renderYearMo}
        </FixedSizeList>
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
