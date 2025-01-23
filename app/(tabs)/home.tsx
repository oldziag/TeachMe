import { View, StyleSheet, TextInput, Text, FlatList,TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState, useEffect } from 'react';
import ButtonComponent from '@/components/Buttons';
import { useRouter } from 'expo-router';
import { getAds, getUsername, getCurrentUser } from 'lib/appwrite'; 
export default function Home() {

  const [announcements, setAnnouncements] = useState<any[]>([]);  
  const [loading, setLoading] = useState<boolean>(true);  
  const [userId, setUserId] = useState<string | null>(null); 
  const [usernames, setUsernames] = useState<any>({}); 
  const router = useRouter();

  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await getCurrentUser(); 
        if (currentUser) {
          setUserId(currentUser.userId);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
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
        console.error("Failed to load announcements:", error);
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
          console.log(`Fetching username for userId: ${userId}`);  
          
          if (userId) {
            const username = await getUsername(userId);  
            fetchedUsernames[userId] = username;
          }
        }
        setUsernames(fetchedUsernames);
      } catch (error) {
        console.error("Error fetching usernames:", error);
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


  return (

    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Search" placeholderTextColor="gray" />
        <Text style={styles.text2}>
          Start now and connect with people who share your passion for{' '}
          <Text style={{ color: '#1c9e92', fontWeight: '600' }}>learning!</Text>
        </Text>

        <View style={styles.container2}>
          <ButtonComponent theme="start" label="Add your advertisement" onPress={() => router.replace('/create_ad')} />
        </View>

        <Text style={{ ...styles.text2, paddingTop: 7 }}> Or </Text>

        <Text
          style={{
            ...styles.text2,
            paddingBottom: 30,
            color: '#1c9e92',
            fontWeight: '400',
            paddingTop: 20,
          }}> See recents </Text>


        <FlatList
          data={announcements}
          keyExtractor={(item) => item.$id} 
          renderItem={({ item }) => (
            <View style={styles.adCard}>
              <Text style={{fontSize:24, fontWeight:500}}>{item.title}</Text>
              <Text style={{fontSize:16}}>
                {usernames[item.userId] || 'Loading username...'}
              </Text>
              <Text style={{fontSize:14}}>{new Date(item.date).toLocaleDateString()}</Text>
            </View>
          )}
        />
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 90,
  },
  scrollContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  container2: {
    marginTop: '5%',
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
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
    marginBottom: -40,
    paddingTop: 30,
  },
  text2: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    paddingTop: 50,
  },
  adCard: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 70,
    width:300,
    borderRadius: 12,
    borderColor: '#ddd',
    borderWidth: 1,
    padding:20,
    marginBottom: 10, 
  },

}
);
