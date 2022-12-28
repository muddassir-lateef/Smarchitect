import React, { useState } from "react";

import { Typography, Card, Grid, Box, Button } from "@mui/material";
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import Avatar from "@mui/material/Avatar";
import SendIcon from "@mui/icons-material/Send";
import Input from "../components/Input";
import { useForm } from "../hooks/form-hook";
import { VALIDATOR_MIN, VALIDATOR_MINLENGTH } from "../util/validators"


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
      <Card sx={{ width: "100%", height:"500px", maxWidth: "300px" }}>
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

            p: 1,
          }}
        >
          <Input
            sx={{ pr: 2, pb: 3, flex: "100%" }}
            id="plot_X_Dimension"
            label="Plot X Dimension in feet"
            variant="standard"
            onInput={InputHandler}
            validators={[VALIDATOR_MIN(10)]}
            errorText="Plot X Dimension must be over 10 feet"
          />
          <Input
            sx={{ pr: 2, pb: 2, flex: "100%" }}
            id="plot_Y_Dimension"
            label="Plot Y Dimension in feet"
            variant="standard"
            onInput={InputHandler}
            validators={[VALIDATOR_MIN(10)]}
            errorText="Plot Y Dimension must be over 10 feet"
          />
          <Input
            sx={{ pr: 2, pb: 3, flex: "100%" }}
            id="bedrooms"
            label="Bedroom Count"
            variant="standard"
            onInput={InputHandler}
            validators={[VALIDATOR_MINLENGTH(1)]}
            errorText="Bedroom Count is a required field"
          />
          <Input
            sx={{ pr: 2, pb: 3, flex: "100%" }}
            id="bathrooms"
            label="Bathroom Count"
            variant="standard"
            onInput={InputHandler}
            validators={[VALIDATOR_MINLENGTH(1)]}
            errorText="Bathroom Count is a required field"
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              alignItems: "center",
              width: "100%",
              p: 1,
            }}
          >
          </Box>
          <Grid container display="flex" justifyContent="flex-end">
            <Button
              onClick={()=>props.onSubmit(formState.inputs)}
              variant="contained"
              endIcon={<SendIcon />}
              sx={{ mt: 2 }}
              disabled={!formState.isValid}
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
