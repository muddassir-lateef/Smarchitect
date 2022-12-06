import React, { useState, useEffect } from 'react'
import { Grid, Button } from '@mui/material';
import { Stage, Layer } from 'react-konva';
import { generateTarget, drawNodes, updateObjects, makeConnection } from '../util/map_graph_util';

const GenerateNewMap = () => {
    const [targets, setTargets] = useState([])
    const [connectors, setConnectors] = useState([])
    const layerRef = React.useRef();
    const [node1, setNode1] = useState("")  //selected node 1
    const [node2, setNode2] = useState("")  //selected node 2

    const setSelectedNode = (newNode) => {
        console.log("Node clicked, before update: ", node1, node2)
        //console.log("Node length, before update: ", nodes.length)
         console.log("Setting node", newNode)
        //  console.log("Prev Node", node)
        if (node1 === "" && node2 === "") {    //no nodes was selected before
            console.log("Adding node 1")
            setNode1(newNode)
            return;
        }
        else if (node1 !== "" && node2 === "") {   //node was selected before 
            if (newNode == node1) {  //same node is selected now
                console.log("Same node selected")
                setNode1("")
                setNode2("")
                removeCircleHighlight();
                return;
            }
            else {
                // nodes[1] = newNode
                console.log("Adding node 2")
                removeCircleHighlight();
                setNode2(newNode)
                return;
            }
        }
        else if (node1 !== "" && node2 !== "" ) {   // new selection alltogether
            console.log("clearing and adding Node 1")
            removeCircleHighlight();
            setNode1(newNode)
            setNode2("")
            return;
        }

    }

    const handleNewNodeClick = () => {
        //console.log("New Node")
        removeCircleHighlight();
        setNode1("")
        setNode2("")
        //console.log(layerRef.current)
        const stage = layerRef.current.parent;
        const tars = generateTarget(targets, stage)
        setTargets(tars)
        console.log("Targetsss: ", tars)

        drawNodes([], [tars[tars.length - 1]], layerRef.current, setSelectedNode)

    }

    const removeCircleHighlight = () => {
        for (var i = 0; i < targets.length; i++) {
            layerRef.current.findOne('#' + targets[i].id).shadowColor('black')
        }
    }

    const addCircleHighlight = () => {
        //for (var i = 0; i < nodes.length; i++) {
            if (node1 !== "")
                layerRef.current.findOne('#' + node1).shadowColor('red')
            if (node2 !== "")
                layerRef.current.findOne('#' + node2).shadowColor('red')
       // }
    }
    const removeExtraCircleHighlights = () => {
        for (var i = 0; i < targets.length; i++) {
            if ( targets[i].id !== node1 && targets[i].id !== node2 )  //node is not selected
                layerRef.current.findOne('#' + targets[i].id).shadowColor('black')
        }
    }


    useEffect(() => {
        console.log("NODES SET: ", node1, node2)
       // console.log("NODES LENGTH: ", nodes.length)
        addCircleHighlight();
        removeExtraCircleHighlights();
        if (node1 !== "" && node2 !== "") {
            console.log("Adding connection")
            removeCircleHighlight();
            var newCons = makeConnection(targets, connectors, node1, node2)
            drawNodes([newCons[newCons.length - 1]], [], layerRef.current)
            setConnectors(newCons)
            updateObjects(targets, connectors, layerRef.current)
        }
        console.log("------------------------")

    }, [node1, node2]);



    return (
        <Grid container sx={{ mt: 1 }} direction="column">
            <Button variant="contained" sx={{ mb: 1 }} onClick={() => { handleNewNodeClick() }}>Add Node</Button>
            <Stage
                style={{
                    border: '2px solid',
                    marginTop: '2px',
                }}
                width={window.innerWidth - 50}
                height={window.innerHeight - 50}
                onDragMove={() => { updateObjects(targets, connectors, layerRef.current) }}

            >
                <Layer ref={layerRef}>

                </Layer>
            </Stage>
        </Grid>
    )
}

export default GenerateNewMap;