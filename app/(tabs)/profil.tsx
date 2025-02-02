import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { useGlobalContext } from "../../context/GlobalProvider";
import { useRouter } from 'expo-router';
import { signOut, getCurrentUser } from '../../lib/appwrite';

const Profile = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [currentScreen, setCurrentScreen] = useState<'profil' | 'dane' | 'ogloszenia'>('profil');
  const { user, setUser, setIsLogged, username, email, phonenumber } = useGlobalContext();
  const router = useRouter();

  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUserId(currentUser.userId);
        }
      } catch (error) {
        console.error('Błąd pobierania danych użytkownika:', error);
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
      console.error("Błąd podczas wylogowania:", error.message);
    }
  };


  if (currentScreen === 'profil') {
    return (
      <ScreenContainer>
        <View style={styles.profileHeader}>
          <Image
            style={styles.image}
            source={user?.avatar ? { uri: user.avatar } : require('../../assets/images/profil3.png')}
          />
          <View>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.email}>{email}</Text>
          </View>
        </View>
        <View style={{alignItems:'center'}}>
          <ProfileButton label="Twoje dane" onPress={() => setCurrentScreen('dane')} />
          <ProfileButton label="Twoje ogłoszenia" onPress={() => setCurrentScreen('ogloszenia')} />
          <ProfileButton label="Uczniowie i korepetytorzy" />
          <ProfileButton label="Skontaktuj się z nami" />
        </View>
        <TouchableOpacity style={styles.logout} onPress={logout}>
          <Text style={styles.text}>Wyloguj się</Text>
        </TouchableOpacity>
      </ScreenContainer>
    );
  }

  
  if (currentScreen === 'dane') {
    return (
      <ScreenContainer>
        <Image
          style={styles.bigAvatar}
          source={user?.avatar ? { uri: user.avatar } : require('../../assets/images/profil3.png')}
        />

        <UserInfo label="Nazwa użytkownika" value={username} />
        <UserInfo label="Email" value={email} />
        <UserInfo label="Numer telefonu" value={phonenumber} />

        <ProfileButton label="Wróć do profilu" onPress={() => setCurrentScreen('profil')} />
      </ScreenContainer>
    );
  }


  if (currentScreen === 'ogloszenia') {
    return (
      <ScreenContainer>
        <Text style={styles.text}>Twoje ogłoszenia</Text>
        <ProfileButton label="Wróć do profilu" onPress={() => setCurrentScreen('profil')} />
      </ScreenContainer>
    );
  }

  return null;
};


const ScreenContainer = ({ children }: { children: React.ReactNode }) => (
  <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
);

const ProfileButton = ({ label, onPress }: { label: string, onPress?: () => void }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.text}>{label}</Text>
  </TouchableOpacity>
);

const UserInfo = ({ label, value }: { label: string, value: string }) => (
  <View style={{ width: '100%', alignItems: 'flex-start' }}>
    <Text style={styles.infoLabel}>{label}</Text>
    <View style={styles.infoContainer}>
      <Text style={styles.infoText}>{value}</Text>
    </View>
  </View>
);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    paddingTop: 60,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft:20,
    paddingTop: 30,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 170,
    marginRight: 15,
  },
  username: {
    color: 'white',
    fontSize: 27,
  },
  email: {
    color: 'white',
    fontSize: 15,
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
  logout: {
    marginTop: 50,
    alignItems: 'center',
  },
  bigAvatar: {
    width: 100,
    height: 100,
    borderRadius: 170,
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 15,
    color: 'white',
    marginTop: 30,
    left: 10,
  },
  infoContainer: {
    borderWidth: 2,
    borderColor: 'gray',
    width: '100%',
    height: 40,
    borderRadius: 18,
    justifyContent: 'center',
    marginTop: 15,
  },
  infoText: {
    fontSize: 21,
    color: 'white',
    marginLeft: 15,
  },
});

export default Profile;
