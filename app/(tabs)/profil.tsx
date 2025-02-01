import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useGlobalContext } from "../../context/GlobalProvider";
import { useRouter } from 'expo-router';
import { signOut, getCurrentUser } from '../../lib/appwrite';

const Profile = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter(); 
  const { user, setUser, setIsLogged, username, email , phonenumber} = useGlobalContext();
  const [currentScreen, setCurrentScreen] = useState<'profil' | 'dane' | 'ogloszenia'>('profil');

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

  if (currentScreen === 'profil') {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            <View style={{ alignItems: 'center', paddingTop: 30 }}>
              <Image
                style={styles.image}
                source={user?.avatar ? { uri: user.avatar } : require('../../assets/images/profil3.png')}
              />
              <Text style={{ color: 'white', position: 'absolute', fontSize: 27, top: 40, left: 130 }}>
                {username}
              </Text>
              <Text style={{ color: 'white', position: 'absolute', fontSize: 15, top: 80, left: 130 }}>
                {email}
              </Text>

              <View style={styles.button}>
                <Text style={styles.text} onPress={() => setCurrentScreen('dane')}> Twoje dane </Text>
              </View>

              <View style={styles.button}>
                <Text style={styles.text} onPress={() => setCurrentScreen('ogloszenia')}> Twoje ogłoszenia </Text>
              </View>

              <View style={styles.button}>
                <Text style={styles.text}> Uczniowie i korepetytorzy</Text>
              </View>

              <View style={styles.button}>
                <Text style={styles.text}> Skontaktuj się z nami</Text>
              </View>

              <View style={{ marginTop: 50 }}>
                <Text style={styles.text} onPress={logout}>Wyloguj się</Text>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }

  if (currentScreen === 'dane') {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            <View style={{ alignItems: 'center', paddingTop: 30 }}>
            <Image
             style={{width:100,height:100,borderRadius:170, marginBottom:15}}
             source={user?.avatar ? { uri: user.avatar } : require('../../assets/images/profil3.png')}
              />

              <View style={{ width: '100%', alignItems: 'flex-start' }}>
                <Text style={{fontSize:15,color:'white',marginTop:30,left:10}}>Nazwa użytkownika</Text>
                <View style={{borderWidth:2,borderColor:'gray',width:'100%',height:40,borderRadius:18,justifyContent:'center',marginTop:15

                }}>
                  <Text style={{fontSize:21,color:'white',marginLeft:15}}>{username}
                 </Text>
                </View> 

                <Text style={{fontSize:15,color:'white',marginTop:30,left:10}}>Email</Text>
                <View style={{borderWidth:2,borderColor:'gray',width:'100%',height:40,borderRadius:18,justifyContent:'center',marginTop:15

                }}>
                  <Text style={{fontSize:21,color:'white',marginLeft:15}}>{email}
                 </Text>
                </View> 
                <Text style={{fontSize:15,color:'white',marginTop:30,left:10}}>Numer telefonu</Text>
                <View style={{borderWidth:2,borderColor:'gray',width:'100%',height:40,borderRadius:18,justifyContent:'center',marginTop:15

                }}>
                  <Text style={{fontSize:21,color:'white',marginLeft:15}}>{phonenumber}
                 </Text>
                </View> 

              </View>
              

              <View style={styles.button}>
                <Text style={styles.text} onPress={() => setCurrentScreen('profil')}>Wróć do profilu</Text>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }


  if (currentScreen === 'ogloszenia') {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            <View style={{ alignItems: 'center', paddingTop: 30 }}>
              <Text style={styles.text}>Twoje ogłoszenia</Text>
              <View style={styles.button}>
                <Text style={styles.text} onPress={() => setCurrentScreen('profil')}>Wróć do profilu</Text>
              </View>
            </View>
            
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    paddingTop: 60,
  },
  button: {
    backgroundColor: 'black',
    width: 300,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  text: {
    color: 'white',
    fontSize: 19,
    fontWeight: '500',
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 170,
    marginBottom: 20,
    left: -110,
  },
});

export default Profile;
