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
let tempURL = URL + "/Login";
console.log(tempURL);
let loginDetails = { username, password };

const response = await axios.patch(tempURL, loginDetails);
return response;
}