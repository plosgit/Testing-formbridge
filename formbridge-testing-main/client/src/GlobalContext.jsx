import {createContext, useEffect, useState} from "react";
import { useNavigate } from "react-router";

const GlobalContext = createContext();

function GlobalProvider({children}) {
  const [user, setUser] = useState(null);

  async function getLogin() {
    const response = await fetch("/api/login", {credentials: 'include'})
    const data = await response.json();
    
    if (response.ok) {
      setUser(data)
    } else {
      setUser(null)
      console.log("Error getting session data")
    }
  }

  async function logout() {
    const response = await fetch('/api/login', {method: 'DELETE', credentials: 'include'})
    const data = await response.json()
    console.log(data)
    await getLogin()
  }

  useEffect(() => {
    getLogin()
  }, []);

  async function UsePost(data, route) {
    try {
      // form/api/tickets is for dynamic routing
      const rawResponse = await fetch(route, {
        // tell the server we want to send/create data
        method: 'post', // and that we will send data json formatted
        headers: {'Content-Type': 'application/json'}, // the data encoded as json
        body: JSON.stringify(data)
      });

      const response = await rawResponse.json();

      rawResponse.ok ? console.log("Connected to backend.. \nConnected to database.. \n" + response.message) : console.log("Could not connect to backend.. \n" + rawResponse.status + " " + rawResponse.statusText);

      // will return an id if there is one, otherwise it will return 0
      // this does not affect our existing code 
      // but allows us to store the id when calling UsePost (see /compoments/Form.jsx postTicket())
      return response.id;

    } catch (error) {
      console.error(error);
    }
  }

  return <GlobalContext.Provider value={{
    UsePost,
    user,
    getLogin,
    logout,
  }}>
    {children}
  </GlobalContext.Provider>
}

export {GlobalContext, GlobalProvider};
