import React, { useState } from "react";

import { Typography, Card, Grid, Box, Button } from "@mui/material";
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import Avatar from "@mui/material/Avatar";
import SendIcon from "@mui/icons-material/Send";
import Input from "../components/Input";
import { useForm } from "../hooks/form-hook";
import { VALIDATOR_MAX, VALIDATOR_MIN, VALIDATOR_MINLENGTH } from "../util/validators"


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
      <Card sx={{ width: "100%", height:"770px", maxWidth: "300px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 1,
            m: 1,
          }}
        >
          <Avatar sx={{ mr: 2 }}>
            <SquareFootIcon />
          </Avatar>
          <Typography variant="h5">Map Constraints</Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            flexWrap: "wrap",
            alignItems: "center",
             mt: 2,
            p: 1,
          }}
        >
          <Input
            sx={{
              marginBottom: '5px',
              border: '1px solid #E0E0E0',
            }}
            id="plot_X_Dimension"
            label="Plot X Dimension in feet"
            variant="standard"
            onInput={InputHandler}
            validators={[VALIDATOR_MIN(10)]}
            errorText="Plot X Dimension must be over 10 feet"
          />
          <Input
            sx={{
              marginBottom: '5px',
              border: '1px solid #E0E0E0',
            }}
            id="plot_Y_Dimension"
            label="Plot Y Dimension in feet"
            variant="standard"
            onInput={InputHandler}
            validators={[VALIDATOR_MIN(10)]}
            errorText="Plot Y Dimension must be over 10 feet"
          />
          <Input
             sx={{
              marginBottom: '5px',
              border: '1px solid #E0E0E0',
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
              marginBottom: '5px',
              border: '1px solid #E0E0E0',
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
              marginBottom: '5px',
              border: '1px solid #E0E0E0',
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
              marginBottom: '5px',
              border: '1px solid #E0E0E0',
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
              marginBottom: '5px',
              border: '1px solid #E0E0E0',
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
              marginBottom: '5px',
              border: '1px solid #E0E0E0',
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
              marginBottom: '5px',
              border: '1px solid #E0E0E0',
            }}
            id="coveredarea"
            label="Covered Area %"
            variant="standard"
            onInput={InputHandler}
            validators={[VALIDATOR_MINLENGTH(1),VALIDATOR_MIN(50), VALIDATOR_MAX(100) ]}
            errorText="% Covered Area should be in range 50-100"
          />
<Input
   sx={{
    marginBottom: '5px',
    border: '1px solid #E0E0E0',
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
          <Grid container display="flex" justifyContent="flex-end">
            <Button
              onClick={()=>props.onSubmit(formState.inputs)}
              variant="contained"
              endIcon={<SendIcon />}
              sx={{ mt: 1 }}
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
