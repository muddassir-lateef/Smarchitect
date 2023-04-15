import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#FF803A",
      light: "#F57663",
      contrastText :"white"
    },
    secondary: {
      main: '#F57663',
    },
    otherColor: {
      main: "#999"
    },


  },
  custom:{
    joins: {
      outerColor: "#F57663",
      innerColor:"white",
      outerRadius:9,
      innerRadius:4
    }
  }
})

