import React, { useContext, useState, useEffect } from 'react';
import LinearScaleIcon from '@mui/icons-material/LinearScale';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import WindowOutlinedIcon from '@mui/icons-material/WindowOutlined';
import StairsIcon from '@mui/icons-material/Stairs';
import { Button, Grid, Card, CardContent, Slider, Typography, Divider, Box } from '@mui/material';
import { DrawingBoardContext } from "../context/DrawingBoardContext";
import PostAddIcon from '@mui/icons-material/PostAdd';
import Input from './Input';
import { CSVLink } from "react-csv";
import Papa from "papaparse";
import { VALIDATOR_REQUIRE } from '../util/validators';
import { useForm } from "../hooks/form-hook";
import { theme } from "../Themes/Default-theme";


const headers = [
    { label: "Type", key: "type" },
    { label: "Width", key: "width" },
    { label: "Height", key: "height" },
    { label: "x", key: "x" },
    { label: "y", key: "y" },
    { label: "id", key: "id" },
    { label: "url", key: "url" },
    { label: "rotation", key: "rotation" },
    { label: "keepRatio", key: "keepRatio" },
    { label: "enabledAnchors", key: "enabledAnchors" },


];


const marks = [
    {
        value: 0.5,
        label: '0.5X',
    },
    {
        value: 1,
        label: '1X',
    },
    {
        value: 1.5,
        label: '1.5X',
    }
    ,
    {
        value: 2,
        label: '2X',
    }

];
export const AttributeWindow = (props) => {
    const { selectedItemCoordinates } = props
    const dbContext = useContext(DrawingBoardContext);
    const { setScale } = props
    const { scale } = props
    const { setExportData } = props
    const { exportData } = props
    const { newId } = props
    const { setNewId } = props
    const { setImageObjects } = props
    const [parsedInputData, setParsedInputData] = useState("");
    const [formState, InputHandler] = useForm(
        {
          name: {
            value: "",
            isValid: false,
            }
        },
        false
      );

    const handleScaleChange = (event, newValue) => {
        setScale(newValue);
    };


    React.useEffect(() => {
        if (parsedInputData !== null) {
            var tempList = [];
            // console.log("LENGTH: ", parsedInputData.length)
            for (let i = 1; i < parsedInputData.length; i++) {
                tempList.push({
                    alt: parsedInputData[i][0],
                    url: parsedInputData[i][6],
                    x: parseFloat(parsedInputData[i][3]),
                    y: parseFloat(parsedInputData[i][4]),
                    width: parseFloat(parsedInputData[i][1]),
                    height: parseFloat(parsedInputData[i][2]),
                    id: parsedInputData[i][5],
                    rotation: parseFloat(parsedInputData[i][7]),
                    keepRatio: (parsedInputData[i][8] === 'true'),
                    enabledAnchors: parsedInputData[i][9].split(',')

                })
            }

            setImageObjects(tempList.slice())

            const tempExp = []
            for (let i = 1; i < parsedInputData.length; i++) {
                tempExp.push({
                    type: parsedInputData[i][0],
                    width: parseFloat(parsedInputData[i][1]),
                    height: parseFloat(parsedInputData[i][2]),
                    x: parseFloat(parsedInputData[i][3]),
                    y: parseFloat(parsedInputData[i][4]),
                    id: parsedInputData[i][5],
                    url: parsedInputData[i][6],
                    rotation: parseFloat(parsedInputData[i][7]),
                    keepRatio: (parsedInputData[i][8] === 'true'),
                    enabledAnchors: parsedInputData[i][9].split(',')

                })
            }
            setNewId(String(parseInt(parsedInputData.length, 10)))
            setExportData(tempExp.slice());
        }
    }, [parsedInputData])

    const intToFeetStr = (x) => {
        x = Math.floor(x)
        var feet = Math.floor(x / 12);
        var inches = (x - (feet * 12));

        return feet.toString() + "'" + inches.toString() + "\""

    }
    useEffect(() => {
        props.setMap_name(formState.inputs.name.value)
    }, [formState.inputs.name.value]);
    return (
        <Card sx={{pl:1, pr:1  }} elevation={0} >
             <Box sx={{  display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#F57663",
                      color: "#fff",
                      borderRadius: "10px 10px 0 0"
                     
          }}>
                    <Typography sx={{ fontSize: 20, fontWeight : "bold"}} color = "black" variant="h7" padding={2} align="center">
                        Entity Attributes
                    </Typography>
                    </Box>

            <Card sx={{ minWidth: 275, maxHeight: 300, p:1 , backgroundColor: "white",
        color: "white",}}>
            
                <CardContent >
                <Box sx={{  
            justifyContent: "center",
            alignItems: "center",
                      height: "100%",
                      width: "100%",
          }}>
                    <Grid container sx={{ mt: 1,  }}>
                        <Typography sx={{ fontSize: 20 ,  fontWeight : "bold" ,}} color="black">
                            X :&nbsp;
                        </Typography>
                        <Typography sx={{ fontSize: 20,  fontWeight : "bold" }} color = "black" component="div">
                            {parseInt(selectedItemCoordinates.x)}
                        </Typography>
                    </Grid>

                    <Grid container sx={{ mt: 1 }}>
                        <Typography sx={{ fontSize: 20 ,  fontWeight : "bold"}} color="black">
                            Y :&nbsp;
                        </Typography>
                        <Typography sx={{ fontSize: 20 ,  fontWeight : "bold" }}  color = "black" component="div">
                            {parseInt(selectedItemCoordinates.y)}
                        </Typography>
                    </Grid>

                    <Grid container sx={{ mt: 1 }}>
                        <Typography sx={{ fontSize: 20,  fontWeight : "bold" }} color="black">
                            Width :&nbsp;
                        </Typography>
                        <Typography sx={{ fontSize: 20,  fontWeight : "bold" }}  color = "black" component="div">
                            {intToFeetStr(parseInt(selectedItemCoordinates.w))}
                        </Typography>
                    </Grid>
                    <Grid container sx={{ mt: 1 }}>
                        <Typography sx={{ fontSize: 20,  fontWeight : "bold" }} color="black">
                            Height :&nbsp;
                        </Typography>
                        <Typography sx={{ fontSize: 20,  fontWeight : "bold" }}  color = "black" component="div">
                            {intToFeetStr(parseInt(selectedItemCoordinates.h))}
                        </Typography>
                    </Grid>
                    <Grid container sx={{ mt: 1 }}>
                        <Typography sx={{ fontSize: 20,  fontWeight : "bold" }} color="black">
                            Angle :&nbsp;
                        </Typography>
                        <Typography sx={{ fontSize: 20 ,  fontWeight : "bold"}} color = "black" component="div">
                            {parseInt(selectedItemCoordinates.angle)}
                        </Typography>
                    </Grid>
            </Box>
                </CardContent>

            </Card>
            <Divider />
            <Box sx={{  display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#F57663",
                      color: "#fff",
                      
                     
          }}>
                    <Typography sx={{ fontSize: 20, fontWeight : "bold"}} color = "black" variant="h7" padding={2} align="center">
                        Scale
                    </Typography>
                    </Box>

            <Card sx={{ minWidth: 275, maxHeight: 300 , p:1, mt:1  ,backgroundColor: "white",
        color: "white",
        }}>
                <CardContent>
                    <Grid container sx={{ mt: 1 }}>
                        <Slider
                            aria-label="Custom marks"
                            defaultValue={1}
                            step={0.1}
                            min={0.5}
                            max={2}
                            value={scale}
                            onChange={handleScaleChange}
                            valueLabelDisplay="auto"
                            marks={marks}
                            sx={{ color: 'black' }}
                        />
                    </Grid>
                </CardContent>

            </Card>
            <Divider />
            {/* 
            <Card sx={{ minWidth: 275, maxHeight: 300 }}>
                <CardContent>
                    <Button sx={{ mt: 1 }} variant="contained" >
                        <CSVLink style={{ textDecoration: 'none', color: 'white' }} data={exportData} headers={headers}>
                            Export Map Data
                        </CSVLink>
                    </Button>

                    <Button sx={{ mt: 1 }} variant="contained" component="label" color="primary">

                        <PostAddIcon /> Upload a file
                        <input type="file" hidden accept=".csv,.xlsx,.xls" onChange={(e) => {
                            const files = e.target.files;
                            console.log(files);
                            if (files) {
                                console.log(files[0]);
                                Papa.parse(files[0], {
                                    complete: function (results) {
                                        console.log("Finished:", results.data);
                                        setParsedInputData(results.data);
                                    }
                                }
                                )
                            }
                        }} />
                    </Button>

                </CardContent>
            </Card>
            */}

            <Card sx={{ minWidth: 275, maxHeight: 300, mt:1 , p:1, textAlign:'center'}} >
                <Typography variant='h5' gutterBottom width={'100%'} >
                    Save Floor Plan
                </Typography>
                <Input
                    sx={{ pr: 2, pb: 3, flex: "100%" , width:'100%', }}
                    
                    id="name"
                    label="Floorplan Name"
                    variant="standard"
                    onInput={InputHandler}
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Floorplan name must be provided"
                />
                <Button sx={{ mt: 1, width:'100%',   backgroundColor: "#F57663",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#FFA546",
              }, }} variant="outlined" disabled={!formState.isValid} onClick={props.createJoins}>
                    <Typography  sx={{ fontSize: 12, fontWeight : "bold"}} color = "black" variant="h7"  align="center">
                        Save
                    </Typography>
                </Button>

            </Card>



        </Card>

    );
};
