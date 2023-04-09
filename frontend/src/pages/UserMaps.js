import React, {useState, useEffect, useContext} from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { GetUserMaps } from "../services/apiServices";
import {
    Button,
    Grid,
    Card,
    CardActions,
    CardContent,
    Typography,
    Box,
    Divider
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import SearchBox from "../components/SearchBox";


const UserMaps = () => {
    const auth = useContext(AuthContext)
    const nav = useNavigate();
    const [searchedMap, setSearchedMap] = useState("");
    const [mapOptions, setMapOptions] = useState([])
    const [maps, setMaps] = useState([])
    const [mapsMaster, setMapsMaster] = useState([])
    useEffect(()=>{
        GetUserMaps(auth.user.ID)
        .then(res=>{
            console.log("DATA: ", res.data)
            setMaps(res.data.filter(item=>item.Floorplan_Name!==""))
            setMapsMaster(res.data.filter(item=>item.Floorplan_Name!==""))
            const temp_list = []
            for (var i=0; i<res.data.length; i++){
                if (res.data[i].Floorplan_Name !== "")
                 temp_list.push(res.data[i].Floorplan_Name)
            }
            setMapOptions(temp_list)

        })
        .catch(err=>console.log("ERROR: ", err))


    }, [])

    const textChange = (value) => {
        setSearchedMap(value);
        //console.log("here: " + value);
        if (typeof value === "string") {
          const filteredArray = mapsMaster.filter((map) => {
            return map.Floorplan_Name.toLowerCase().includes(value.toLowerCase());
          });
          setMaps(filteredArray);
        }
        if (value.length === 0) setMaps(mapsMaster);
        
    };

    const handleViewClick = (id) => {
        console.log("Floor Plan ID Clicked : ", id)
        auth.setSelectedMap(id)
        nav('/')
    }

    return (
    <Grid container spacing={3} padding={2}>
      <Grid item xs={12}>
        <SearchBox
          onChange={textChange}
          inputValue={searchedMap}
          options={mapOptions}
          label="Map Name"
        />
      </Grid>

      {maps.map((item) => (
        <Grid
          item
          sm={12} 
          md={6}
          lg={4}
          key={item.Floorplan_ID}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Card sx={{ maxWidth: 320, minWidth:320 }}>
            <CardContent sx={{backgroundColor:'#f9f9f9'}}>
              <Typography gutterBottom variant="h5" component="div" textAlign={'center'}>
                {item.Floorplan_Name}
              </Typography>
              
            </CardContent>
            <Divider/>

            <CardActions>
                
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                
                <Button
                  sx={{ width: "100%" }}
                  variant="outlined"
                  component="label"
                  startIcon={<EditIcon />}
                  onClick={() => handleViewClick(item.Floorplan_ID)}
                >
                  View
                </Button>
              </Box>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
    )
}

export default UserMaps;