import React, {useState} from 'react'
import { Grid, Button } from '@mui/material';
import { Stage, Layer } from 'react-konva';
import { generateTarget , drawNodes, generateConnectors, updateObjects} from '../util/map_graph_util';

const GenerateNewMap = () => {
    const [targets, setTargets] = useState([])
    const [connectors, setConnectors] = useState([])
    const layerRef = React.useRef();
    const [isNodeSelected, setIsNodeSelected] = useState(false)
    const [node, setNode] = useState({})
    const setSelectedNode = (node) => {
        console.log("Setting node", node)
        setNode(node)
    }   
    const toggleIsNodeSelected = () => {
        console.log("In function", isNodeSelected)
        setIsNodeSelected(value => !value)
        return isNodeSelected
    }
    const handleNewNodeClick = () =>{
        console.log(layerRef.current)
        console.log("1")
        const stage =  layerRef.current.parent;
        const tars = generateTarget(targets, stage)
        console.log("2", tars.length)
        setTargets(tars)
        const cons = generateConnectors(connectors, tars)
        console.log("3")
        setConnectors(cons)
        console.log("4")

        drawNodes([cons[cons.length-1]], [tars[tars.length-1]], layerRef.current, setSelectedNode)
        console.log("5")

    }

    return (
        <Grid container sx={{ mt: 1 }}>
            <Button variant="contained" sx={{mb:1}} onClick={handleNewNodeClick}>Add Node</Button>
            <Stage
                style={{
                    border: '2px solid',
                    marginTop: '2px',
                }}
                width={900}
                height={800}
                onDragMove={()=>{updateObjects(targets, connectors, layerRef.current)}}
            // onMouseDown={checkDeselect}
            // onTouchStart={checkDeselect}
            // ref={stageRef}
            >
                <Layer ref={layerRef}>

                </Layer>
            </Stage>
        </Grid>
    )
}

export default GenerateNewMap;