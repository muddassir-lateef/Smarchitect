import React, { useEffect, useContext, useState } from 'react';
import { Button, Typography, Grid } from '@mui/material';
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
    width: 800,
    height: 500,
    bgcolor: "transparent",
    borderRadius: '2%',
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
    async function closeModal () {
        setModalOpen(false);
        await unload();
    };
    const enable3D = () => {
        setDisable3D(false)

    }
    const parseConnection = (connection) => {
        console.log(connection)

        let str = "";
        for (let key in connection) {
            if (typeof connection[key] === 'number') {
                str += parseInt(connection[key]);
            } else {
                str += connection[key];
            }
            str += ",";
        }
        str = str.slice(0, -1); // Remove the last comma  
        return str
    }

    const [connections, setConnections] = useState([])
    const { unityProvider, unload, sendMessage, loadingProgression, isLoaded } = useUnityContext({
        loaderUrl: "assets/build/MapGen3d.loader.js",
        dataUrl: "assets/build/MapGen3d.data.unityweb",
        frameworkUrl: "assets/build/MapGen3d.framework.js.unityweb",
        codeUrl: "assets/build/MapGen3d.wasm.unityweb",
    });
    useEffect(() => {
        if (modalOpen == true && connections.length > 0 && isLoaded) {
            for(var i=0;i<connections.length;i++){
            
          //  for (var i = 1; i < 2; i++) {
                console.log(parseConnection(connections[i]))
                setTimeout(sendMessage("MapGenerator", "GenerateAssetP", parseConnection(connections[i])),3000)
                ;

            }
        }
        // This function will run when the component mounts
        console.log('Component mounted');
    }, [isLoaded]);


    return (
        <Grid sx={{ display: 'flex', pt: 4, pl: 1 }}  >
            <DrawingToolBox />
            <DrawingCanvas
                testBtn={testBtn}
                testBtn2={testBtn2}
                mapName={mapName}
                enable3D={enable3D}
                selectedItemCoordinates={selectedItemCoordinates}
                setSelectedItemCoordinates={setSelectedItemCoordinates}
                scale={scale}
                exportData={exportData}
                setExportData={setExportData}
                ImageObjects={ImageObjects}
                setImageObjects={setImageObjects}
                newId={newId}
                setNewId={setNewId}
                setCons={setConnections}

            />

            <AttributeWindow
                disable3D={disable3D}
                onVisualizeClick={openModal}
                selectedItemCoordinates={selectedItemCoordinates}
                scale={scale}
                setScale={setScale}
                exportData={exportData}
                setNewId={setNewId}
                setImageObjects={setImageObjects}
                setExportData={setExportData}
                createJoins={() => {
                    setTestBtn(testBtn + 1)
                }}
                setMap_name={(newname) => {
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


                            <Grid item xs={12}>
                                {!isLoaded && (
                                    <p>Loading Application... {Math.round(loadingProgression * 100)}%</p>
                                )}
                                <Unity
                                    unityProvider={unityProvider}
                                    style={{ width: 800, height: 500, visibility: isLoaded ? "visible" : "hidden" }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}

                                >


                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Fade>
            </Modal>

        </Grid>

    );

};

