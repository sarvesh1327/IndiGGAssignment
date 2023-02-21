import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import getAuthToken from "../../helpers/getAuthToken";

export const PrivateRoute = () => {
  const [loggedIn, setLoggedIn] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      const token = getAuthToken();
      if(!token){
        setLoggedIn(false);
        return;
      }
      const response = await axios.get("http://localhost:4003/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userResponse = response.data;
      if (userResponse.success === false) {
        setLoggedIn(false)
      }else{
        setLoggedIn(true);
      }
      console.log(userResponse);
    };
    fetchUser();
  }, []);
  return loggedIn ? <Outlet /> : <Navigate to="/login" />;
};
