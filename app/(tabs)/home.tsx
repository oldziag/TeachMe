import { View, StyleSheet, TextInput, Text, FlatList, TouchableWithoutFeedback, ScrollView, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import ButtonComponent from '@/components/Buttons';
import { getAds, getUsername, getCurrentUser, getAvatar, Message, getMessages } from 'lib/appwrite'; 
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 
import { useGlobalContext } from "../../context/GlobalProvider";

type Usernames = { [userId: string]: string };
type Avatars = { [userId: string]: string };

export default function Home() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [usernames, setUsernames] = useState<Usernames>({});
  const [avatar, setAvatars] = useState<Avatars>({});
  const [currentScreen, setCurrentScreen] = useState<'home' | 'recents' | 'AdView'|'kontakt'>('home');
  const [selectedAd, setSelectedAd] = useState<any | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) setUserId(currentUser.userId);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);



useEffect(() => {
  const fetchMessages = async () => {
    if (userId && selectedAd?.userId) {
      try {
        const msgs = await getMessages(userId, selectedAd.userId);
        setMessages(msgs);
      } catch (error) {
        console.error("Błąd pobierania wiadomości:", error);
      }
    }
  };

  fetchMessages();
  const interval = setInterval(fetchMessages, 1000); 
  return () => clearInterval(interval);
}, [userId, selectedAd?.userId]);

  useEffect(() => {
    const fetchAdsData = async () => {
      try {
        const data = await getAds();
        setAnnouncements(data);
      } catch (error) {
        console.error('Failed to load announcements:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdsData();
  }, []);

  const fetchUsernameAndAvatar = async (userId: string) => {
    try {
      if (!usernames[userId]) {
        const username = await getUsername(userId);
        setUsernames({ ...usernames, [userId]: username });
      }

      if (!avatar[userId]) {
        const avatarUrl = await getAvatar(userId);
        setAvatars((prev) => ({ ...prev, [userId]: avatarUrl }));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };


  const sendMessage = async () => {
    if (!userId || !selectedAd?.userId || !messageText.trim()) {
      console.error("Brak wymaganych danych do wysłania wiadomości.");
      return;
    }
  
    try {
      await Message(userId, selectedAd.userId, messageText);
      console.log("Wiadomość wysłana!");
  
      setMessageText(""); 
    } catch (error) {
      console.error("Błąd podczas wysyłania wiadomości:", error);
    }
  };

  useEffect(() => {
    if (selectedAd?.userId) {
      fetchUsernameAndAvatar(selectedAd.userId);
    }
  }, [selectedAd?.userId]);





  if (currentScreen === 'home') {
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            style={styles.input}
            placeholder="Szukaj"
            placeholderTextColor="gray"
          />
          <Ionicons name="search" size={21} color="gray" style={styles.icon} />
        </View>

        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
          {[
            { name: 'Matematyka', image: require('assets/images/matematyka.png') },
            { name: 'Biologia', image: require('assets/images/biology.png') },
            { name: 'Fizyka', image: require('assets/images/fizyka.png') },
            { name: 'Informatyka', image: require('assets/images/informatyka.png') },
            { name: 'Chemia', image: require('assets/images/chemia.png') },
          ].map((category, index) => (
            <TouchableWithoutFeedback key={index} onPress={() => {
              setSelectedCategory(category.name);
              setCurrentScreen('recents');
            }}>
              <View style={styles.categoryItem}>
                <Image source={category.image} style={styles.image} />
                <Text style={styles.categoryText}>{category.name}</Text>
              </View>
            </TouchableWithoutFeedback>
          ))}
        </ScrollView>

        <Text style={styles.text2}>
          Zacznij teraz i dziel się swoją pasją do{' '}
          <Text style={{ color: '#1c9e92', fontWeight: '600' }}>nauki!</Text>
        </Text>

        <View style={styles.container2}>
          <ButtonComponent theme="start" label="Dodaj ogłoszenie" onPress={() => router.replace("/create_ad")} />
        </View>
      </View>
    );
  }

  
  if (currentScreen === 'recents') {
    return (
      <View style={styles.container}>
        <FlatList
          data={announcements.filter(item => !selectedCategory || item.category === selectedCategory)}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback
              onPress={() => {
                setSelectedAd(item);
                setCurrentScreen('AdView');
              }}>
              <View style={styles.adCard}>
                <Text style={{ fontSize: 23, fontWeight: '400', marginBottom: 10 }}>{item.title}</Text>
                <Text style={{ fontSize: 14 }}>{new Date(item.date).toLocaleDateString()}</Text>
              </View>
            </TouchableWithoutFeedback>
          )}
        />
        <Text
          onPress={() => setCurrentScreen('home')}
          style={{
            color: '#1c9e92',
            fontSize: 30,
            paddingBottom: 20,
            fontWeight: '600',
          }}>
          Powrót
        </Text>
      </View>
    );
  }

 
  if (currentScreen === 'AdView' && selectedAd) {
    return (
      <ScrollView>
        <View style={{ flex: 1 ,backgroundColor:'black'}}>
          <View style={styles.adCard2}>
            <Ionicons
              name='arrow-undo'
              onPress={() => setCurrentScreen('recents')}
              style={{
                color: '#1c9e92',
                fontSize: 40,
                fontWeight: '600',
                left: 15,
              }} />

            <View style={{alignItems:'center',marginBottom:10}}>
              {selectedAd.userId && avatar[selectedAd.userId] && (
              <Image source={{ uri: avatar[selectedAd.userId] }} style={styles.avatar} 
                onError={(e) => console.log("Błąd ładowania obrazu", e.nativeEvent.error)} >
              </Image>
            )}
            
            {selectedAd.userId && usernames[selectedAd.userId] && (
              <Text style={{ fontSize: 20, fontWeight: '300', color: 'white', textAlign: 'center',left:-3 ,marginTop:10}}>
                {usernames[selectedAd.userId]}</Text>
            )}
            </View>
            <Text style={{ fontSize: 28,color:'white', padding: 15, textAlign: 'center', fontWeight: '700' }}>{selectedAd.title}</Text>
            <Text style={{ fontSize: 20, fontWeight: '300', color:'white',marginTop:15,marginLeft:5,marginRight:5}}>{selectedAd.description}</Text>
            <Text style={{ fontSize: 21, fontWeight: '600',  marginTop:90,color:'white'}}>Cena:{'\n'}</Text>
            <Text style={{  paddingBottom: 15, fontSize: 18,color:'white' }}>{selectedAd.price} zł/godzinę</Text>
            <Text style={{ fontSize: 21, fontWeight: '600', color:'white', paddingTop: 50 }}>Data dodania:{'\n'}</Text>
            <Text style={{ paddingBottom: 15, fontSize: 18,color:'white' }}>
              {new Date(selectedAd.date).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
            <View style={{alignItems:'center',borderWidth:1,borderColor:'white',height:60,width:190,marginBottom:80,justifyContent:'center',marginTop:30,borderRadius:18}}>
                <Text style={{fontSize:26,color:'#1c9e92',fontWeight:400}} onPress={() => setCurrentScreen('kontakt')}>Skontaktuj się</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }




  if (currentScreen === 'kontakt') {
    return (
      <View style={styles.container}>
        <Text style={{color:'white',fontSize:24}}> {usernames[selectedAd.userId]}</Text>
        <FlatList style={{width:'100%',height:'90%'}}
          data={messages}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.senderId === userId ? styles.sentMessage : styles.receivedMessage]}>
              <Text style={{ color: 'black' }}>{item.message} </Text>
          </View>
        )}

        inverted/>
        <TextInput style={{marginTop:15,backgroundColor:'white',width:'83%',height:52,marginBottom:10, borderRadius:17,paddingHorizontal:10,left:-22}}
        placeholder='Napisz wiadomość...'
        placeholderTextColor='gray'
        value={messageText} 
        onChangeText={(text) => setMessageText(text)}
        
        />
        <View style={{alignSelf:'flex-end', bottom:43,right:20}}><Ionicons name='send' size={20} color={'white'} onPress={(sendMessage)}/></View>
        
     </View>
    );
  }


  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:90,
    backgroundColor: '#000000',
    alignItems: 'center',
  },
  input: {
    backgroundColor: 'white',
    width: '90%',
    height:50,
    borderRadius: 18,
    fontSize: 18,
    paddingHorizontal: 15,
    marginBottom: 20,
    marginLeft: 15,
  },
  container2: {
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    top: -90,
  },
  
  icon: {
    position: 'absolute',
    right: 10,
    top: 15
  },
  text: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  imageScroll: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: 'white',
    margin: 10,
  },
  text2: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    position: 'absolute',
    top: 450,
  },
  categoryText: {
    color: 'white',
    fontSize: 16,
    marginTop: 5,
    textAlign: 'center',
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
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    justifyContent: 'center',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 50,
    marginRight: 10,
    borderWidth:2,
    borderColor:'black,',
  },
  username: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  messageBubble: {
    marginBottom:30,
    padding: 10,
    borderRadius: 16,
  
  },
  sentMessage: {
   width:180,
   alignSelf:'flex-end',
   right:20,
    backgroundColor: 'white',

  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 18,
    width: '90%',
    height: 60,
    position: 'absolute',
    bottom: 20,
    paddingHorizontal: 10,
  },
  messageInput: {
    flex: 1,
    fontSize: 17,
  },
});
