
import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet,Image,TouchableOpacity, ScrollView } from 'react-native';
import Button from '@/components/Buttons';
import { useGlobalContext } from "../../context/GlobalProvider";
import { useRouter } from 'expo-router'; 
import { signOut,getCurrentUser } from '../../lib/appwrite'; 
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';

const Profile = () => {
    const [userId, setUserId] = useState<string | null>(null);
  const { user, setUser, setIsLogged } = useGlobalContext();
  const router = useRouter(); 
  const { username } = useGlobalContext();
  const { email } = useGlobalContext();


  useEffect(() => {
      const fetchUserData = async () => {
        try {
          const currentUser = await getCurrentUser();
          if (currentUser) {
            setUserId(currentUser.userId);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchUserData();
    }, []);




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
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          style={styles.container} 
          keyboardShouldPersistTaps="handled"
        >
          <View style={{alignItems:'center', paddingTop:30 }}> 
            <Image 
            style={{width:130,height:130,borderRadius:100
            }}
            source={require('assets/images/profil3.png')}></Image>
            <Text style={{color:'white',fontSize:19,paddingTop:30 }}>Nazwa użytkownika:</Text>
            <Text style={{color:'white',fontSize:19,paddingTop:30 }}>{username}</Text>
            <Text style={{color:'white',fontSize:19,paddingTop:30 }}>Email:</Text>
            <Text style={{color:'white',fontSize:19,paddingTop:30 }}>{email}</Text>
            <View style={{marginTop: 50}}>
              <Button 
                theme="start" 
                label="Wyloguj się" 
                onPress={logout} 
              />
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    paddingTop: 60,

 
  },
  text: {
    color:'white',
    fontSize: 24,
    marginBottom: 50,
    fontWeight: 'bold',

  },
  image:
  {

    width:130,
    height:130,
    borderRadius:170,

  }
});

export default Profile;
