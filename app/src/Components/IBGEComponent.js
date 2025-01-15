import React, { useEffect, useState } from 'react'
import './IBGEComponentStyle.css'
import useMediaQuery from '@mui/material/useMediaQuery';
import { InputLabel, Button, Select } from '@mui/material'
import DeselectIcon from '@mui/icons-material/Deselect';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import categoriesTree from '../Util/categoriesTree.js'
import FileSaver from 'file-saver'
import PulseLoader from 'react-spinners/PulseLoader'
import { TreeView, TreeItem} from '@mui/lab';
import { StyledEngineProvider } from '@mui/material/styles';
import MultiChartComponent from './MultiChartComponent.js';

let yearMo = []
const currYear = new Date().getFullYear()
for (let i = 2000; i <= currYear; i++) {
  yearMo.push(i.toString());
}
const apiUrl = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';

function IBGEComponent(props) {

  const isMobile = useMediaQuery('(max-width:600px)', { noSsr: true });

  const [, setImg] = useState(null);
  const [expanded, setExpanded] = useState(['7170']);
  // const [selected, setSelected] = useState(['7170']);
  const [selected, setSelected] = useState(['7170','7445','7486','7558','7625','7660','7712','7766','7786']);
  const [selectedCut, setSelectedCut] = useState('2000');
  const [loading, setLoading] = useState(false)
  const [graphData, setGraphData] = useState(null)

  const fetchImage = async (type) => {
    let items = selected;
    const yearMo = selectedCut+"01"

    const size = isMobile ? 'mobile' : 'desktop'
    setLoading(true)
    const res = await fetch(apiUrl+'/'+type+'?items='+items.join(',')+'&cut='+yearMo+'&type=real&size='+size, { mode: 'cors' });
    setLoading(false)
    if (res.status === 204) {
      alert('Nenhum dado para a seleção escolhida')
    }
    if (type === 'graph') {
      const imageBlob = await res.blob();
      const imageObjectURL = URL.createObjectURL(imageBlob);
      setImg(imageObjectURL);
    } else if (type === 'csv') {
      const csvBlob = await res.blob();
      FileSaver.saveAs(csvBlob, "dados.csv");
    } else if (type === 'graph_data') {
      const data = await res.json()
      setGraphData(data)
    }
  };

  useEffect(() => {
    fetchImage('graph_data');
  }, []);


  const handleYearMoChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedCut(value);
  };
  
  const handleToggle = (event, nodeIds) => {
    // console.log(event.target.nodeName)
    if (event.target.nodeName !== "svg" && event.target.nodeName !== "path") {
      return;
    }
    setExpanded(nodeIds);
  };

  const handleSelect = (event, nodeIds) => {
    if (event.target.nodeName === "svg" || event.target.nodeName === "path") {
      return;
    }
    const first = nodeIds[0];
    if (selected.includes(first)) {
      setSelected(selected.filter(id => id !== first));
    } else {
      setSelected([first, ...selected]);
    }
  };

  const generateTree = (nodes) => {
    if ( nodes.CodItem === "0" ) {
      return (nodes.children.map((node) => generateTree(node)))
    }
      
    return (
      <StyledEngineProvider injectFirst key={nodes.CodItem}>
        <TreeItem 
          label={nodes.year ? nodes.label+' - até '+nodes.year : nodes.label} 
          nodeId={nodes.CodItem} 
          key={nodes.CodItem}
          className="treeItem"
          sx={{
            '& .MuiTreeItem-iconContainer svg': {
              fontSize: '30px !important',
            },
          }}>
          {Array.isArray(nodes.children)
            ? nodes.children.map((node) => generateTree(node))
            : null}
        </TreeItem>
      </StyledEngineProvider>

    )
  }

  const makeXSeries = (series) => {
    let result = []
    for (const item in series) {
      result.push(new Date(series[item]).getTime())
    }
    return result
  }

  const makeYSeries = (series) => {
    let result = []
    for (const [key,value] of Object.entries(series)) {
      if (key !== 'YearMo') {
        // console.log(key, value)
        result.push({
          name: key,
          data: value
        })
      }
    }
    return result
  }

  return (
    <div className="container">
      <h2> Pesquisa por componente da inflação </h2>
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        selected={selected}
        expanded={expanded}
        onNodeSelect={handleSelect}
        onNodeToggle={handleToggle}
        multiSelect
        className="picker">
          {generateTree(categoriesTree)}
      </TreeView>
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
      <Button className="clearButton" color="error" startIcon={<DeselectIcon />} onClick={() => { setSelected([]);setExpanded([]); return}} >
        Limpar seleção
      </Button>
      
      <div className="buttonsContainer">
        <Button sx={{ marginRight: 1 }} color="custom" variant="contained" className="button" disabled={selected.length > 0 ? false : true} onClick={() => fetchImage('graph_data')} >
          Gerar gráfico
        </Button>
        <Button sx={{ marginRight: 1 }} color="custom" variant="contained" className="button" disabled={selected.length > 0 ? false : true} onClick={() => fetchImage('csv')} >
          Exportar CSV
        </Button>
      </div>
      {!loading && graphData ? <MultiChartComponent
        title=""
        xTitle=""
        yTitle={"Variação (%)"}
        lineTitle="Valor no mês"
        ySeries={makeYSeries(graphData)}
        xSeries={makeXSeries(graphData['YearMo'])}
        format={'percentage'}
      /> : <PulseLoader />}
      <div className="obs"> Fonte: https://servicodados.ibge.gov.br/api/docs/agregados?versao=3 </div>
    </div>
  );
}

export default IBGEComponent;
