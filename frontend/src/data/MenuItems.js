import DoorSymbol from "../assets/FloorPlanSymbols/door_symbol.svg";
import WallSymbol from "../assets/FloorPlanSymbols/wall_symbol.svg";
import WindowSymbol from "../assets/FloorPlanSymbols/window_symbol.svg";
import StairsSymbol from "../assets/FloorPlanSymbols/stairs_symbol.svg";

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
        width:15,
        height: 100,
        rotation: 0,
        keepRatio: true,
        enabledAnchors: ['top-center', 'bottom-center'],
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
