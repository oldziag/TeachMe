import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, FlatList
} from 'react-native';
import { useGlobalContext } from "../../context/GlobalProvider";
import { useRouter } from 'expo-router';
import { signOut, getCurrentUser, getAds } from '../../lib/appwrite';
import { Ionicons } from '@expo/vector-icons'; 

const Profile = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [currentScreen, setCurrentScreen] = useState<'profil' | 'dane' | 'ogloszenia'|'AdView'>('profil');
  const { user, setUser, setIsLogged, username, email, phonenumber } = useGlobalContext();
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [selectedAd, setSelectedAd] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
      const fetchAdsData = async () => {
        try {
          const data = await getAds();
          setAnnouncements(data);
        } catch (error) {
          console.error('Błąd ładowania ogłoszeń:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchAdsData();
    }, []);

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
        <View style={{backgroundColor:'black', alignItems:'center'}}>
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
        </View>
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
      
        <View style={{alignItems:'center',width:'100%',backgroundColor:'black',paddingTop:15}}>
        <ProfileButton label="Wróć do profilu" onPress={() => setCurrentScreen('profil')} />
        <FlatList style={{marginTop:20}}
          data={announcements.filter((item) => item.userId === user.userId)}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback
              onPress={() => {
                setSelectedAd(item);
                setCurrentScreen('AdView');
              }}>
              <View style={styles.adCard}>
                <Text style={styles.titleText}>{item.title}</Text>
                <Text style={{ fontSize: 14 }}>{new Date(item.date).toLocaleDateString()}</Text>
              </View>
            </TouchableWithoutFeedback>
          )}
        />
        </View>
    
    );
  }
  if (currentScreen === 'AdView') {
    return (
      
      <ScrollView>
      <View style={{ flex: 1 ,backgroundColor:'black'}}>
        <View style={styles.adCard2}>
          <Ionicons
            name='arrow-undo'
            onPress={() => setCurrentScreen('ogloszenia')}
            style={{
              color: '#1c9e92',
              fontSize: 40,
              fontWeight: '600',
              left: 15,
            }} />

          <View style={{alignItems:'center',marginBottom:10}}>
          </View> 
          <View style={{marginLeft:16}}>
          <Text style={{ fontSize: 28,color:'white', padding: 15, textAlign: 'center', fontWeight: '700' }}>{selectedAd.title}</Text>
          <Text style={{ fontSize: 20, fontWeight: '300', color:'white',marginTop:15,marginLeft:5,marginRight:5}}>{selectedAd.description}</Text>
          <Text style={{ fontSize: 21, fontWeight: '600',  marginTop:90,color:'white'}}>Cena:{'\n'}</Text>
          <Text style={{  paddingBottom: 15, fontSize: 18,color:'white' }}>{selectedAd.price} zł/godzinę</Text>
          <Text style={{ fontSize: 21, fontWeight: '600', color:'white', paddingTop: 50 }}>Data dodania:{'\n'}</Text>
          <Text style={{ paddingBottom: 15, fontSize: 18,color:'white' }}>
            {new Date(selectedAd.date).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
           </View>
        </View>
      </View>
    </ScrollView>
    );
  }

  return null;
};


const ScreenContainer = ({ children }: { children: React.ReactNode }) => (
  <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, }}>
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
  adCard: {
    marginTop: 15,
    flex: 1,
    width: 370,
    backgroundColor: '#fff',
    height: 130,
    borderRadius: 20,
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 20,
    marginBottom: 10,
  },
  adCard2: {
    backgroundColor: 'black',
    height: '200%',
    width: '100%',
    paddingTop: 50,
  },
  titleText:{
    fontSize: 23, 
    fontWeight: '400',
     marginBottom: 10
  },
});

export default Profile;
