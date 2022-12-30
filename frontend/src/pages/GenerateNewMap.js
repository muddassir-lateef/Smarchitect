import React, { useState, useEffect } from 'react'
import { Grid, Button } from '@mui/material';
import { Stage, Layer } from 'react-konva';
import { generateTarget, drawNodes, updateObjects, makeConnection } from '../util/map_graph_util';
import { UpdateUser } from '../services/apiServices';
import ConstraintsForm from '../components/ContraintsForm';

const GenerateNewMap = () => {
    const stageW = 900
    const stageH = 800
    const [targets, setTargets] = useState([])
    const [connectors, setConnectors] = useState([])
    const layerRef = React.useRef();
    const [nodes, setNodes] = useState([])    //list with max size 2
    const [submitClicked, setSubmitClicked] = useState(false)
    const setSelectedNode = (newNode) => {
        setNodes(prevState => [...prevState, newNode]);
      /*  console.log("Node clicked, before update: ", nodes)
        console.log("Node length, before update: ", nodes.length)
         console.log("Setting node", newNode.attrs.id)
        //  console.log("Prev Node", node)
        if (nodes.length === 0) {    //no nodes was selected before
            console.log("Adding node 1")
            //layerRef.current.findOne('#' + newNode.attrs.id).shadowColor('red')
            setNodes([newNode]);
            return;
        }
        else if (nodes.length === 1) {   //node was selected before 
            if (newNode.attrs.id == nodes[0].attrs.id) {  //same node is selected now
                console.log("Same node selected")
                setNodes([])
                removeCircleHighlight();
                return;
            }
            else {
                // nodes[1] = newNode
                console.log("Adding node 2")
                removeCircleHighlight();
                setNodes(prevState => [...prevState, newNode]);
                return;
            }
        }
        else if (nodes.length === 2) {   // new selection alltogether
            console.log("clearing and adding Node 1")
            removeCircleHighlight();
            //layerRef.current.findOne('#' + newNode.attrs.id).shadowColor('red')
            setNodes([newNode])
            return;
        }*/

    }

    const handleNewNodeClick = () => {
        removeCircleHighlight();
        setNodes([])
        //console.log(layerRef.current)
        const stage = layerRef.current.parent;
        const tars = generateTarget(targets, stage)
        setTargets(tars)
        console.log("Targetsss: ", tars)

        drawNodes(connectors, [tars[tars.length - 1]], layerRef.current, setSelectedNode)

    }

    const removeCircleHighlight = () => {
        for (var i = 0; i < targets.length; i++) {
            layerRef.current.findOne('#' + targets[i].id).shadowColor('black')
        }
    }

    const addCircleHighlight = () => {
        //for (var i = 0; i < nodes.length; i++) {
           // console.log("Highlighted: ", nodes[i].attrs.id)
           if (nodes.length % 2 === 1)
            layerRef.current.findOne('#' + nodes[nodes.length-1].attrs.id).shadowColor('red')
       // }
    }
    const removeExtraCircleHighlights = () => {
        for (var i = 0; i < targets.length; i++) {
            if (nodes.find(node => node.attrs.id === targets[i].id) === undefined)  //node is not selected
                layerRef.current.findOne('#' + targets[i].id).shadowColor('black')
        }
    }


    useEffect(() => {
        console.log("NODES SET: ", nodes)
        addCircleHighlight();
        removeExtraCircleHighlights();
        // console.log("SELECT STATUS: ", isNodeSelected)
        if ( nodes.length > 1 && nodes.length % 2 === 0){
            console.log("Adding connection")
            removeCircleHighlight();
            var newCons = makeConnection(targets, connectors, nodes[nodes.length - 2].attrs.id, nodes[nodes.length - 1].attrs.id)
            drawNodes([newCons[newCons.length - 1]], [], layerRef.current, setSelectedNode)
            setConnectors(newCons)
            console.log("New connections: ", newCons)
            updateObjects(targets, connectors, layerRef.current)
        }

        /*   layerRef.current.findOne('#' + node.attrs.id).attrs.shadowColor = 'red';*/
    }, [nodes]);

    const onSubmitFormHandler = (formInputs) => {
        setSubmitClicked(true)
        console.log("INPUTS: ", formInputs);
        var bedrooms = parseInt(formInputs.bedrooms.value);
        var bathrooms = parseInt(formInputs.bathrooms.value);
        var carporch = parseInt(formInputs.carporch.value);
        var coveredarea = parseInt(formInputs.coveredarea.value);
        var drawingrooms = parseInt(formInputs.drawingrooms.value);
        var gardens = parseInt(formInputs.gardens.value);
        var kitchens = parseInt(formInputs.kitchens.value);
        var livingrooms = parseInt(formInputs.livingrooms.value);
        var plot_x = parseInt(formInputs.plot_X_Dimension.value);
        var plot_y = parseInt(formInputs.plot_Y_Dimension.value);





        removeCircleHighlight();
        setNodes([])
        const stage = layerRef.current.parent;
        for (var i=0; i<bedrooms; i++){
        //console.log(layerRef.current)
           // console.log("GEnerate Target called, i: ", i)
            var tag = 'bedroom-' + i;
            const tars = generateTarget(targets, stage, i, tag)
            setTargets(tars)
            console.log("Targetsss: ", tars)
            drawNodes(connectors, [tars[tars.length - 1]], layerRef.current, setSelectedNode)
        }

        for (var i=0; i<bathrooms; i++){
            var tag = 'bathroom-' + i;
            const tars = generateTarget(targets, stage, i + bedrooms, tag) 
            setTargets(tars)
            console.log("Targetsss: ", tars)
            drawNodes(connectors, [tars[tars.length - 1]], layerRef.current, setSelectedNode)
        }
        for (var i=0; i<carporch; i++){
            var tag = 'carporch-' + i;
            const tars = generateTarget(targets, stage, i + bedrooms + bathrooms, tag) 
            setTargets(tars)
            console.log("Targetsss: ", tars)
            drawNodes(connectors, [tars[tars.length - 1]], layerRef.current, setSelectedNode)
        }
        for (var i=0; i<drawingrooms; i++){
            var tag = 'drawingroom-' + i;
            const tars = generateTarget(targets, stage, i + bedrooms + bathrooms + carporch, tag) 
            setTargets(tars)
            console.log("Targetsss: ", tars)
            drawNodes(connectors, [tars[tars.length - 1]], layerRef.current, setSelectedNode)
        }
        for (var i=0; i<gardens; i++){
            var tag = 'garden-' + i;
            const tars = generateTarget(targets, stage, i + bedrooms + bathrooms + carporch + drawingrooms, tag) 
            setTargets(tars)
            console.log("Targetsss: ", tars)
            drawNodes(connectors, [tars[tars.length - 1]], layerRef.current, setSelectedNode)
        }
        for (var i=0; i<kitchens; i++){
            var tag = 'kitchen-' + i;
            const tars = generateTarget(targets, stage, i + bedrooms + bathrooms + carporch + drawingrooms + gardens, tag) 
            setTargets(tars)
            console.log("Targetsss: ", tars)
            drawNodes(connectors, [tars[tars.length - 1]], layerRef.current, setSelectedNode)
        }
        for (var i=0; i<livingrooms; i++){
            var tag = 'livingroom-' + i;
            const tars = generateTarget(targets, stage, i + bedrooms + bathrooms + carporch + drawingrooms + gardens + kitchens, tag) 
            setTargets(tars)
            console.log("Targetsss: ", tars)
            drawNodes(connectors, [tars[tars.length - 1]], layerRef.current, setSelectedNode)
        }

    }

const buttonClicked = () => {
    console.log("Hello")
    UpdateUser("MudiLund", "PassWord123NewNew").then((res) => {
        console.log(res)
    })
}

    return (
        <Grid container sx={{pt:5}}>
            {/*<Grid item xs={12}><Button sx={{w:'100%'}} variant="contained"  onClick={handleNewNodeClick}>Add Node</Button></Grid>*/}
            <Grid item xs={4}><ConstraintsForm submitClicked = {submitClicked} onSubmit={onSubmitFormHandler}></ConstraintsForm></Grid>
            <Grid item xs={8} sx={{pb:2}}>
            <Stage
                width={800}
                height={800}
                style={{ width: '800px', height: '900px', marginLeft: '5px', marginTop: '2px', border: '2px solid red' }}
                //style={{
                 //   border: '2px solid',
                 //   marginTop: '2px',
                //}}
                onDragMove={() => { updateObjects(targets, connectors, layerRef.current) }}

            >
                <Layer ref={layerRef}>

                </Layer>
            </Stage>
            </Grid>
            <Grid item xs = {8} sx = {{pd:2}}>
                <Button variant = "contained" onClick = {buttonClicked}>
                    Test Button1
                </Button>
            </Grid>
        </Grid>
    )
}

export default GenerateNewMap;