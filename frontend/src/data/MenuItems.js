import DoorSymbol from "../assets/door_symbol.svg";
import WallSymbol from "../assets/wall_symbol.svg";
import WindowSymbol from "../assets/window_symbol.svg";
import StairsSymbol from "../assets/stairs_symbol.svg";

export const initial_menuItems = [
    //eligible anchors: ['top-left', 'top-center', 'top-right', 'middle-right', 'middle-left', 'bottom-left', 'bottom-center', 'bottom-right']
    {
        alt: "Wall",
        url: WallSymbol,
        width: 15,
        height: 100,
        rotation: 0,
        keepRatio: false,
        enabledAnchors: ['top-center', 'bottom-center'],
    },
    {
        alt: "Door",
        url: DoorSymbol,
        width: 70,
        height: 50,
        rotation: 0,
        keepRatio: true,
        enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    },
    {
        alt: "Window",
        url: WindowSymbol,
        width: 20,
        height: 100,
        rotation: 0,
        keepRatio: false,
        enabledAnchors: ['top-center', 'bottom-center'],
    },
    {
        alt: "Stairs",
        url: StairsSymbol,
        width: 31,
        height: 100,
        rotation: 0,
        keepRatio: false,
        enabledAnchors: ['top-left', 'top-center', 'top-right', 'middle-right', 'middle-left', 'bottom-left', 'bottom-center', 'bottom-right'],
    },


]
