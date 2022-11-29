import React, { useContext } from 'react';
import LinearScaleIcon from '@mui/icons-material/LinearScale';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import WindowOutlinedIcon from '@mui/icons-material/WindowOutlined';
import StairsIcon from '@mui/icons-material/Stairs';
import { Grid, Card, CardContent, Slider, Typography, Divider } from '@mui/material';
import { DrawingBoardContext } from "../context/DrawingBoardContext";


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
    const handleScaleChange = (event, newValue) => {
        setScale(newValue);
    };
    const intToFeetStr = (x) => {
        x = Math.floor(x)
        var feet = Math.floor(x / 12);
        var inches = (x - (feet * 12));

        return feet.toString() + "'"+inches.toString()+"\""

    }
    return (
        <Card >
            <Card sx={{ minWidth: 275, maxHeight: 300 }}>
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        Entity Attributes
                    </Typography>
                    <Grid container sx={{ mt: 1 }}>
                        <Typography sx={{ fontSize: 20 }} color="red">
                            x:&nbsp;
                        </Typography>
                        <Typography sx={{ fontSize: 20 }} component="div">
                            {parseInt(selectedItemCoordinates.x)}
                        </Typography>
                    </Grid>

                    <Grid container sx={{ mt: 1 }}>
                        <Typography sx={{ fontSize: 20 }} color="red">
                            y:&nbsp;
                        </Typography>
                        <Typography sx={{ fontSize: 20 }} component="div">
                            {parseInt(selectedItemCoordinates.y)}
                        </Typography>
                    </Grid>

                    <Grid container sx={{ mt: 1 }}>
                        <Typography sx={{ fontSize: 20 }} color="red">
                            Width:&nbsp;
                        </Typography>
                        <Typography sx={{ fontSize: 20 }} component="div">
                            {intToFeetStr(parseInt(selectedItemCoordinates.w))}
                        </Typography>
                    </Grid>
                    <Grid container sx={{ mt: 1 }}>
                        <Typography sx={{ fontSize: 20 }} color="red">
                            Height:&nbsp;
                        </Typography>
                        <Typography sx={{ fontSize: 20 }} component="div">
                            {intToFeetStr(parseInt(selectedItemCoordinates.h))}
                        </Typography>
                    </Grid>
                    <Grid container sx={{ mt: 1 }}>
                        <Typography sx={{ fontSize: 20 }} color="red">
                            angle:&nbsp;
                        </Typography>
                        <Typography sx={{ fontSize: 20 }} component="div">
                            {parseInt(selectedItemCoordinates.angle)}
                        </Typography>
                    </Grid>

                </CardContent>

            </Card>
            <Divider />
            <Card sx={{ minWidth: 275, maxHeight: 300 }}>
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        Scale
                    </Typography>
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
                        />
                    </Grid>
                </CardContent>

            </Card>

        </Card>

    );
};
