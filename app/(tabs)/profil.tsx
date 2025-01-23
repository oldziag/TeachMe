import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '@/components/Buttons';
import { useGlobalContext } from "../../context/GlobalProvider";
import { useRouter } from 'expo-router'; 
import { signOut } from '../../lib/appwrite'; 

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const router = useRouter(); 

  const logout = async () => {
    try {
      await signOut(); 
      setUser(null); 
      setIsLogged(false); 
      router.replace("/sign-in"); 
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Your Profile</Text>
      <Button 
        theme="start" 
        label="Log out" 
        onPress={logout} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    marginBottom: 50,
    fontWeight: 'bold',
  },
});

export default Profile;
