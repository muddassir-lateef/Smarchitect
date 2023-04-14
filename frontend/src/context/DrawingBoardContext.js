import { createContext } from "react";

export const DrawingBoardContext = createContext({
    selectedTool:"",
    setSelectedTool: () => { },

    selectedAsset: {},
    selectedSource: "",
    setSelectedAsset: () => { },
    setSelectedSource: () => { },

    selectedImgInstance:"",
    setSelectedImgInstance: () => { },

    selectedImages:"",
    setSelectedImgInstance: () => { },

    showPagination: false,
    setShowPagination: ()=>{},

    mapDim : {w:100, h:100},
    setMapDim: ()=>{},

});