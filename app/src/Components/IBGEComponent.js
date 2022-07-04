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

let yearMo = []
const currYear = new Date().getFullYear()
for (let i = 2000; i <= currYear; i++) {
  yearMo.push(i.toString());
}

function IBGEComponent(props) {

  const isMobile = useMediaQuery('(max-width:600px)', { noSsr: true });

  const [img, setImg] = useState(null);
  const [expanded, setExpanded] = useState(['7170']);
  const [selected, setSelected] = useState(['7170']);
  const [selectedCut, setSelectedCut] = useState('2000');


  const fetchImage = async (type) => {
    let items = selected;
    const yearMo = selectedCut+"01"

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


  const handleYearMoChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedCut(value);
  };
  
  const handleToggle = (event, nodeIds) => {
    if (event.target.nodeName !== "svg") {
      return;
    }
    setExpanded(nodeIds);
  };

  const handleSelect = (event, nodeIds) => {
    if (event.target.nodeName === "svg") {
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
      <TreeItem 
        label={nodes.year ? nodes.label+' - até '+nodes.year : nodes.label} 
        nodeId={nodes.CodItem} 
        key={nodes.CodItem}
        className="treeItem">
        {Array.isArray(nodes.children)
          ? nodes.children.map((node) => generateTree(node))
          : null}
      </TreeItem>
    )
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
        <Button sx={{ marginRight: 1 }} color="custom" variant="contained" className="button" disabled={selected.length > 0 ? false : true} onClick={() => fetchImage('graph')} >
          Gerar gráfico
        </Button>
        <Button sx={{ marginRight: 1 }} color="custom" variant="contained" className="button" disabled={selected.length > 0 ? false : true} onClick={() => fetchImage('csv')} >
          Exportar CSV
        </Button>
      </div>
      { img ? <img src={img} className="imgResults" alt="IBGE chart" width={isMobile ? "350px" : "800px"}/> : <PulseLoader /> }
    </div>
  );
}

export default IBGEComponent;
