import * as React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import SignIn from '../forms/Signin';

export default function Authentication() {



  return (

    <Grid container paddingTop={{ "sm": 15, "xs": 5 }} direction="column" align="center">
      <Grid item container height={{ "sm": "70vh", "xs": "90vh" }} display="flex" justifyContent="center">
        <Grid width={{ "sm": 400, "xs": 300 }}  display="flex">

          <Paper elevation={10} sx={{ padding: 2, margin: "20px auto", borderRadius: 4 }} >
            <SignIn />
          </Paper>

        </Grid>

      </Grid>


    </Grid>
  );
}


