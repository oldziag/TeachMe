import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, getUsername, getEmail,getPhonenumber } from "../lib/appwrite";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email,setEmail]=useState(null);
  const [phonenumber,setPhonenumber]=useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await getCurrentUser();
        if (res) {
          setIsLogged(true);
          setUser(res);
        } else {
          setIsLogged(false);
          setUser(null);
          setUsername(null);
          setEmail(null);
          setPhonenumber(null);
          
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);


  useEffect(() => {
    const fetchUsername = async () => {
      if (user?.userId) {
        try {
          const fetchedUsername = await getUsername(user.userId);
          setUsername(fetchedUsername);
        } catch (error) {
          console.log("Error fetching username:", error);
        }
      } else {
        setUsername(null);
      }
    };

    fetchUsername();
  }, [user]); 
  


  useEffect(() => {
    const fetchEmail = async () => {
      if (user?.userId) {
        try {
          const fetchedEmail = await getEmail(user.userId);
          setEmail(fetchedEmail);
        } catch (error) {
          console.log("Error fetching email:", error);
        }
      } else {
        setEmail(null);
      }
    };

    fetchEmail();
  }, [user]); 

  useEffect(() => {
    const fetchPhonenumber = async () => {
      if (user?.userId) {
        try {
          const fetchedPhonenumber = await getPhonenumber(user.userId);
          setPhonenumber(fetchedPhonenumber);
        } catch (error) {
          console.log("Error fetching phonenumber:", error);
        }
      } else {
        setPhonenumber(null);
      }
    };

    fetchPhonenumber();
  }, [user]); 


  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        username,
        setUsername, 
        loading,
        email,
        setEmail,
        phonenumber,
        setPhonenumber,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
