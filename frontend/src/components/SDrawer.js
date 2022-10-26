import { Drawer, List, ListItem, ListItemIcon, ListItemButton, ListItemText, Toolbar, Collapse } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import React, { useState, useContext } from "react";
import ClassIcon from '@mui/icons-material/Class';
import Face6Icon from '@mui/icons-material/Face6';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddIcon from '@mui/icons-material/Add';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import DoorSymbol from "../assets/door_symbol.svg";
import WallSymbol from "../assets/wall_symbol.svg";
import WindowSymbol from "../assets/window_symbol.svg";
import RectangleSymbol from "../assets/Rectangle.svg"
import { AuthContext } from "../context/AuthContext";
import { Grid } from "@mui/material";
const drawerWidth = 240;
const initial_menuItems = [
  {
    
    menuTitle: "Assets",
    visible: false,
    enteries: [{
      alt: "Door",
      url: DoorSymbol,
      width: 7,
      height: 100
    },
    {
      alt: "Wall",
      url: WallSymbol,
      width: 16,
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
    }
    ]
  }



]


const SDrawer = (props) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState(initial_menuItems);

  const updateMenuItemsVisibility = (index) => {
    let temp_menu_items = menuItems;
    temp_menu_items[index].visible = !temp_menu_items[index].visible;
    setMenuItems(temp_menu_items);
  }

  const { mobileOpen } = props;
  const { handleDrawerToggle } = props;

  const handleSideBarClick = (path) => {
    console.log("open")
    if (mobileOpen) handleDrawerToggle();
    navigate(path, { replace: true });
  }
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
                  <Grid container spacing={1} width="100%">
                    <Grid item xs={6}>
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
