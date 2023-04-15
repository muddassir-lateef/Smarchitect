import axios from "axios";
//let URL = "https://orca-app-5kw65.ondigitalocean.app/";
let URL = "http://127.0.0.1:8000/";

export async function UpdateUser(username, password) {
    console.log("Here")
  let tempURL = URL + "/Users";
  console.log(tempURL);
  let loginDetails = { username, password };

  const response = await axios.post(tempURL, loginDetails);
  if (response.status === 201) {
    return response;
  } else if (response.status === 401) {
    return -1;
  }
}



export async function Login(username, password) {
  console.log("Here")
let tempURL = URL + "Login";
console.log(tempURL);
let loginDetails = { username, password };

const response = await axios.patch(tempURL, loginDetails);
return response;
}

export async function register(firstname, lastname, username, password) {
  console.log("Here")
  let tempURL = URL + "/Users";
  console.log(tempURL);
  //let loginDetails = { username, password };
  console.log("HERE: ", { firstname, lastname, username, password })
  let loginDetails = { firstname, lastname, username, password };

  const response = await axios.post(tempURL, loginDetails);
  return response;
}

export async function SaveMap(name, length, width, userId, Joins, Labels) {
  let tempURL = URL + "/Floorplan";
  console.log(tempURL);
  //let loginDetails = { username, password };
  const newJoins = []
  if (Array.isArray(Joins) && Joins.length > 0){
    for (var i=0; i<Joins.length; i++){
      newJoins.push({X1:Joins[i].x1, Y1: Joins[i].y1, X2:Joins[i].x2, Y2: Joins[i].y2, Type: Joins[i].type})
    }
  }
  console.log("New Joins: ", newJoins)
  let mapInfo = { name, length:500, width:500, userId, Joins:newJoins, Labels };
  console.log("SENDING MAP INFO: ", mapInfo)
  const response = await axios.post(tempURL, mapInfo);
  return response;
}

export async function GetMap(mapId) {
  let tempURL = URL +  "getFloorplan/"
  tempURL = tempURL + mapId 

  const response = await axios.get(tempURL)
  if(response.status === 201)
  {
    console.log("Floor Plan Details")
    console.log(response.data)
  }
  return response;
}
export async function GetUserMaps(userId) {
  let tempURL = URL + "/Floorplan";
  console.log(tempURL);
  const response = await axios.patch(tempURL, {user_Id: userId});
  return response;
}

export async function GetMapConnections(mapId) {
  let tempURL = URL + "/getFloorplan/";
  tempURL = tempURL + mapId;
  console.log(tempURL);
  const response = await axios.get(tempURL);
  console.log(response.data)
  return response;
}

export async function GenerateMap(connectors, w, h) {
  let tempURL = URL + "GenerateFloorPlan";
  console.log(tempURL);
  console.log("Connectors: ", connectors)
  const response = await axios.patch(tempURL, {connectors, w, h});
  return response;
}