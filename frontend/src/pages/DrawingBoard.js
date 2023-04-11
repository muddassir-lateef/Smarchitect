import React, { useContext, useState } from 'react';
import { Stage, Layer, Image, Transformer } from 'react-konva';
import { Button, Card, Stack, Tooltip, Typography, Grid, CardActionArea, Toolbar, Box } from '@mui/material';
import { DrawingBoardContext } from "../context/DrawingBoardContext";
import { DrawingToolBox } from "../components/DrawingToolBox"
import { DrawingCanvas } from "../components/DrawingCanvas"
import { AttributeWindow } from "../components/AttributeWindow"
import { GetMap } from '../services/apiServices';

export const DrawingBoard = () => {
    const dbContext = useContext(DrawingBoardContext);
    const [selectedItemCoordinates, setSelectedItemCoordinates] = React.useState({ x: 0, y: 0, w: 0, h: 0, angle: 0 })
    const [scale, setScale] = React.useState(1)
    const [exportData, setExportData] = React.useState([]);
    const [ImageObjects, setImageObjects] = React.useState([]);
    const [newId, setNewId] = React.useState('1');

    const [testBtn, setTestBtn] = React.useState(1)
    const [testBtn2, setTestBtn2] = React.useState(1)
    const [mapName, setMapName] = React.useState("")
    return (
        
        <Grid sx={{ display: 'flex', justifyContent: 'center',  pt:4, pl:1 }}  >
            <DrawingToolBox />
            <DrawingCanvas
                testBtn={testBtn}
                testBtn2={testBtn2}
                mapName = {mapName}

                selectedItemCoordinates={selectedItemCoordinates}
                setSelectedItemCoordinates={setSelectedItemCoordinates}
                scale={scale}
                exportData={exportData}
                setExportData={setExportData}
                ImageObjects={ImageObjects}
                setImageObjects={setImageObjects}
                newId={newId}
                setNewId={setNewId}
            />
            <AttributeWindow
                selectedItemCoordinates={selectedItemCoordinates}
                scale={scale}
                setScale={setScale}
                exportData={exportData}
                setNewId={setNewId}
                setImageObjects={setImageObjects}
                setExportData={setExportData}
                createJoins = {() => {
                    setTestBtn(testBtn + 1)
                }}
                setMap_name = {(newname)=>{
                   // console.log("Setting name to: ", newname)
                    setMapName(newname)
                }}


            />

            

        </Grid>

    );

};


