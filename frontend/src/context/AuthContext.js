import { createContext } from "react";

export const  AuthContext = createContext({
    isLogged: false, 
    user : null,
    selectedAsset: {width:100, height:100},
    selectedSource : "",
    setSelectedAsset: ()=>{},
    setSelectedSource: ()=>{},
    setUser: ()=>{},
    login: () => {},
    logout: () => {}
});