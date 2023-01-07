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

export async function Signup(firstName, lastName, username, password) {
  console.log("Here")
  let tempURL = URL + "/Users";
  console.log(tempURL);
  //let loginDetails = { username, password };
  console.log("HERE: ", { firstName, lastName, username, password })
  let loginDetails = { firstName, lastName, username, password };

  const response = await axios.post(tempURL, loginDetails);
  return response;
}

export async function SaveMap(name, length, width, userId, Joins) {
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
  let mapInfo = { name, length, width, userId, Joins:newJoins };
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
  return response;
}