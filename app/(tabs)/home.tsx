import { View, StyleSheet, TextInput, Text, FlatList, TouchableWithoutFeedback, ScrollView, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import ButtonComponent from '@/components/Buttons';
import { getAds, getUsername, getCurrentUser } from 'lib/appwrite';
import { router } from 'expo-router';

export default function Home() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [usernames, setUsernames] = useState<any>({});
  const [currentScreen, setCurrentScreen] = useState<'home' | 'recents' | 'AdView'>('home');
  const [selectedAd, setSelectedAd] = useState<any | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        if (announcements.length === 0) return;
        const fetchedUsernames = {};

        for (const announcement of announcements) {
          const userId = announcement.userId;
          if (userId) {
            const username = await getUsername(userId);
            fetchedUsernames[userId] = username;
          }
        }
        setUsernames(fetchedUsernames);
      } catch (error) {
        console.error('Error fetching usernames:', error);
      }
    };

    fetchUsernames();
  }, [announcements]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading announcements...</Text>
      </View>
    );
  }

  if (currentScreen === 'home') {
    return (
      <View style={styles.container}>
        <TextInput style={styles.input} placeholder="Szukaj" placeholderTextColor="gray" />
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

        <Text style={{ color: 'white', fontSize: 24, paddingBottom: 10 }}>
          {selectedCategory ? `Ogłoszenia dla: ${selectedCategory}` : 'Wszystkie ogłoszenia'}
        </Text>

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
                <Text style={{ fontSize: 24, fontWeight: '400' }}>{item.title}</Text>
                <Text style={{ fontSize: 14 }}>{new Date(item.date).toLocaleDateString()}</Text>
              </View>
            </TouchableWithoutFeedback>
          )}
        />
      </View>
    );
  }

  if (currentScreen === 'AdView' && selectedAd) {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text
            onPress={() => setCurrentScreen('recents')}
            style={{
              color: '#1c9e92',
              fontSize: 30,
              paddingBottom: 20,
              fontWeight: '600',
            }}> Back </Text>

          <View style={styles.adCard2}>
            <Text style={{ fontSize: 30, padding: 15, textAlign: 'center', fontWeight: '500' }}>{selectedAd.title}</Text>
            <Text style={{ fontSize: 24, fontWeight: '400', textAlign: 'center' }}>{selectedAd.description}</Text>
            <Text style={{ fontSize: 24, fontWeight: '800', textAlign: 'center', paddingTop: 50 }}>Category:{"\n"} </Text>
            
            <Text style={{ textAlign: 'center', paddingBottom: 15, fontSize: 22 }}>{selectedAd.category}</Text>
            <Text style={{ fontSize: 24, fontWeight: '800', textAlign: 'center', paddingTop: 50 }}>Price:{"\n"} </Text>
            <Text style={{ textAlign: 'center', paddingBottom: 15, fontSize: 22 }}>{selectedAd.price}</Text>
            <Text style={{ fontSize: 24, fontWeight: '800', textAlign: 'center', paddingTop: 50 }}>Date:{"\n"} </Text>
            <Text style={{ textAlign: 'center', paddingBottom: 15, fontSize: 22 }}>{new Date(selectedAd.date).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 90,
  },
  container2: {
    
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',

    top:-90,
  },
  input: {
    backgroundColor: 'white',
    width: '90%',
    height: 50,
    borderRadius: 18,
    fontSize: 18,
    paddingHorizontal: 15,
    marginBottom: 20,
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
  image:{

    left:0,
    width:130,
    height:130,
    borderRadius:100,
    borderWidth:3,
    borderColor:'white',
    margin:10,
  },
  text2: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    position:'absolute',
    top:450,
    
  },
  categoryText: {
    color: 'white',
    fontSize: 16,
    marginTop: 5,
    textAlign: 'center',
  },
  adCard: {
    backgroundColor: '#fff',
    height:100,
    width:'100%',
    borderRadius: 12,
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 20,
    marginBottom: 10,
  },
  adCard2: {
    backgroundColor: '#fff',
    height:'100%',
    width:'100%',
    borderRadius: 12,
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 20,
    marginBottom: 10,
  },
});
