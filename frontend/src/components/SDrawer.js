import { Drawer, List, ListItemButton, ListItemText, Toolbar, Collapse } from "@mui/material";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import React, { useState, useContext } from "react";

import DoorSymbol from "../assets/door_symbol.svg";
import WallSymbol from "../assets/wall_symbol.svg";
import WindowSymbol from "../assets/window_symbol.svg";
import StairsSymbol from "../assets/stairs_symbol.svg";
import RectangleSymbol from "../assets/Rectangle.svg"
import { AuthContext } from "../context/AuthContext";
import { Grid } from "@mui/material";
const drawerWidth = 240;
const initial_menuItems = [
  {
    
    menuTitle: "Assets",
    visible: true,
    enteries: [{
      alt: "Door",
      url: DoorSymbol,
      width: 140,
      height: 100
    },
    {
      alt: "Wall",
      url: WallSymbol,
      width: 6,
      height: 100
    },
    {
      alt: "Rectangle",
      url: RectangleSymbol,
      width: 100,
      height: 100
    },
    {
      alt: "Window",
      url: WindowSymbol,
      width: 16,
      height: 100
    },
    {
      alt: "Stairs",
      url: StairsSymbol,
      width: 31,
      height: 100
    },
    ]
  }



]


const SDrawer = (props) => {
  const auth = useContext(AuthContext);
  const [menuItems, setMenuItems] = useState(initial_menuItems);

  const updateMenuItemsVisibility = (index) => {
    let temp_menu_items = menuItems;
    temp_menu_items[index].visible = !temp_menu_items[index].visible;
    setMenuItems(temp_menu_items);
  }

  const { mobileOpen } = props;
  const { handleDrawerToggle } = props;

  const [studentMenuOpen, setStudentMenuOpen] = React.useState(true);

  const handleStudentMenuClick = (index) => {
    updateMenuItemsVisibility(index);
    setStudentMenuOpen(!studentMenuOpen);
  };

  return (
    <div>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <List >

          {menuItems.map((menu, index) => (
            <div key={index}>
              <ListItemButton onClick={()=>handleStudentMenuClick(index)}>
                <ListItemText primary={menu.menuTitle} />
                {menu.visible ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={menu.visible} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>

                {menu.enteries.map((img1, i) => (
                    <img
                      key={i}
                      style={{ width: '100px',height: '100px' }}
                      alt={img1.alt}
                      src={img1.url}
                      draggable="true"
                      onDragStart={(e) => {
                        auth.setSelectedAsset(img1);
                        auth.setSelectedSource(e.target.src)
                        //selectObj(img1)
                      }}
                    />

                 ))}
                </List>
              </Collapse>
            </div>
          ))}

        </List>
      </Drawer>


      
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <List>

          {menuItems.map((menu, index) => (
            <div key={index}>
              <ListItemButton onClick={()=>handleStudentMenuClick(index)}>
                <ListItemText primary={menu.menuTitle} />
                {menu.visible ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={menu.visible} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>

                {menu.enteries.map((img1, i) => (
                  <Grid key={i} container spacing={1} width='100%' alignItems={'center'}>
                    <Grid item xs={6} justifyItems='center' sx={{ mb:2, display: "flex", justifyContent: "space-around" }}>
                    <img
                      key={i}
                      style={{ width: '50px',height: '50px' }}
                      alt={img1.alt}
                      src={img1.url}
                      draggable="true"
                      onDragStart={(e) => {
                        auth.setSelectedAsset(img1);
                        auth.setSelectedSource(e.target.src)
                      //  dragUrl.current = e.target.src;
                        //selectObj(img1)
                      }}
                    />
                    </Grid>
                    <Grid item xs={6}>
                    <label>{img1.alt}</label>
                    
                    </Grid>
                    </Grid>

                 ))}
                </List>
              </Collapse>
            </div>
          ))}

        </List>
      </Drawer>

    </div>
  );
};

export default SDrawer;
