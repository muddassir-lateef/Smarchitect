import React, { useState } from "react";

import { Typography, Card, Grid, Box, Button } from "@mui/material";
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import Avatar from "@mui/material/Avatar";
import SendIcon from "@mui/icons-material/Send";
import Input from "../components/Input";
import { useForm } from "../hooks/form-hook";
import { VALIDATOR_MAX, VALIDATOR_MIN, VALIDATOR_MINLENGTH } from "../util/validators"
import { theme } from "../Themes/Default-theme";


const ConstraintsForm = (props) => {

  const [formState, InputHandler] = useForm(
    {
      bedrooms: {
        value: 0,
        isValid: false,
      },
      bathrooms: {
        value: 0,
        isValid: false,
      },
      livingrooms: {
        value: 0,
        isValid: false,
      },
      kitchens: {
        value: 0,
        isValid: false,
      },
      carporch: {
        value: 0,
        isValid: false,
      },
      drawingrooms: {
        value: 0,
        isValid: false,
      },
      coveredarea: {
        value: 0,
        isValid: false,
      },
      gardens: {
        value: 0,
        isValid: false,
      },
      plot_Y_Dimension: {
        value: 0,
        isValid: false,
      },
      plot_X_Dimension: {
        value: 0,
        isValid: false,
      },
    },
    false
  );



  return (
    <Grid justifyContent="center" display="flex" flex-direction="row">
      <Card sx={{ width: "100%", height:"800px", maxWidth: "300px", }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: '4px 4px',
            backgroundColor: "#F57663",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "#FFA546",
                      },
          }}
        >
          <Avatar sx={{ mr: 2 }}>
            <SquareFootIcon />
          </Avatar>
          <Typography variant="h6">Map Constraints</Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            flexWrap: "wrap",
            alignItems: "center",
    
          }}
        >
          <Input
            sx={{

            }}
            id="plot_X_Dimension"
            label="Plot X Dimension in feet"
            variant="standard"
            onInput={InputHandler}
            validators={[VALIDATOR_MIN(10)]}
            errorText="Must be over 10 feet"
          />
          <Input
            sx={{

            }}
            id="plot_Y_Dimension"
            label="Plot Y Dimension in feet"
            variant="standard"
            onInput={InputHandler}
            validators={[VALIDATOR_MIN(10)]}
            errorText="Must be over 10 feet"
          />
          <Input
             sx={{

            }}
            id="bedrooms"
            label="Bedroom Count"
            variant="standard"
            onInput={InputHandler}
            validators={[VALIDATOR_MINLENGTH(1)]}
            errorText="Bedroom Count is a required field"
          />
          <Input
            sx={{
  
            }}
            id="bathrooms"
            label="Bathroom Count"
            variant="standard"
            onInput={InputHandler}
            validators={[VALIDATOR_MINLENGTH(1)]}
            errorText="Bathroom Count is a required field"
          />
          <Input
             sx={{
    
            }}
            id="livingrooms"
            label="Living Rooms"
            variant="standard"
            onInput={InputHandler}
            validators={[VALIDATOR_MINLENGTH(1)]}
            errorText="Living Rooms is a required field"
          />
          <Input
             sx={{
   
            }}
            id="kitchens"
            label="Kitchens"
            variant="standard"
            onInput={InputHandler}
            validators={[VALIDATOR_MINLENGTH(1)]}
            errorText="Kitchens is a required field"
          />
          <Input
             sx={{
     
            }}
            id="carporch"
            label="Car Porch"
            variant="standard"
            onInput={InputHandler}
            validators={[VALIDATOR_MINLENGTH(1)]}
            errorText="Car Porch is a required field"
          />
          <Input
             sx={{
 
            }}
            id="drawingrooms"
            label="Drawing Rooms"
            variant="standard"
            onInput={InputHandler}
            validators={[VALIDATOR_MINLENGTH(1)]}
            errorText="Drawing rooms is a required field"
          />
          <Input
             sx={{
 
            }}
            id="coveredarea"
            label="Covered Area %"
            variant="standard"
            onInput={InputHandler}
            validators={[VALIDATOR_MINLENGTH(1),VALIDATOR_MIN(50), VALIDATOR_MAX(100) ]}
            errorText="Area should be in range 50-100"
          />
<Input
   sx={{

  }}
  id="gardens"
  label="Garden"
  variant="standard"
  onInput={InputHandler}
  validators={[VALIDATOR_MINLENGTH(1)]}
  errorText="Gardens is a required field"
/>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              alignItems: "center",
              width: "100%",
             
            }}
          >
          </Box>
          <Grid container display="flex" justifyContent="center" >
            <Button 
              onClick={()=>props.onSubmit(formState.inputs)}
              variant="contained"
              endIcon={<SendIcon />}
              sx={{ mt: 1, justifyContent: "center",
              alignItems: "center",  backgroundColor: "#F57663",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#FFA546",
              }, }}
              disabled={!formState.isValid || props.submitClicked}
            >
              Draw Nodes
            </Button>
          </Grid>
        </Box>
      </Card>
    </Grid>
  );
};

export default ConstraintsForm;
