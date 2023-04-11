import React, { useContext, useState } from 'react';
import { Stage, Layer, Image, Transformer } from 'react-konva';
import { Button, Card, Stack, Tooltip, Typography, Grid, CardActionArea, Toolbar, Box } from '@mui/material';
import { DrawingBoardContext } from "../context/DrawingBoardContext";
import { DrawingToolBox } from "../components/DrawingToolBox"
import { DrawingCanvas } from "../components/DrawingCanvas"
import { AttributeWindow } from "../components/AttributeWindow"
import { GetMap } from '../services/apiServices';
import { Modal, Backdrop, Fade, Box } from "@mui/material";
import { Unity, useUnityContext } from "react-unity-webgl";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 250,
    bgcolor: "background.paper",
    borderRadius: '2%',
    boxShadow: 24,
    p: 4,
};

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
    const [modalOpen, setModalOpen] = useState(false);
    const [disable3D, setDisable3D] = useState(true)
    const openModal = (username) => {
        setModalOpen(true);
    };
    const closeModal = () => {
        setModalOpen(false);
    };
    const enable3D = () => {
        setDisable3D(false)

    }
    const { unityProvider } = useUnityContext({
        loaderUrl: "../../public/WebGLBuild/Build/WebGLBuild.loader.js",
        dataUrl: "../../public/WebGLBuild/Build/WebGLBuild.data",
        frameworkUrl: "../../public/WebGLBuild/Build/WebGLBuild.framework.js",
        codeUrl: "../../public/WebGLBuild/Build/WebGLBuild.wasm",
      });
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

          {/*{  <Button onClick={() => {
                setTestBtn(testBtn + 1)
            }}>Tester</Button>
            <Button onClick={() => {
                setTestBtn2(testBtn2 + 1)
            }}>Tester2</Button>*/}
            <Modal
                aria-labelledby="transition-modal-title"
                open={modalOpen}
                onClose={closeModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={modalOpen}>
                    <Box sx={style}>
                        <Grid container>
                            <Grid item>
                                <Typography
                                    id="transition-modal-title"
                                    variant="h6"
                                    component="h2"
                                    sx={{ mb: 2 }}
                                >
                                    Your New Home
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Unity unityProvider={unityProvider} />
                            </Grid>

                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}

                                >

                                    <Button
                                        onClick={closeModal}
                                        variant="contained"
                                        component="label"
                                        sx={{ mr: 3 }}
                                    >
                                        Close
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Fade>
            </Modal>
            

        </Grid>

    );

};


