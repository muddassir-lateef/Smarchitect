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
    },
    canvas: {
      width: 800,
      height:800,
      bgColor:"#F4F5FA",
      bRadius:10
    },
    palette:{
        background:"#F4F5FA"
      
    }    

  }
})

