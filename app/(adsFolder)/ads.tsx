import { StyleSheet, Text, View, FlatList, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { useLocalSearchParams,  router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { getAds } from 'lib/appwrite';

const AdsScreen = () => {
  const { category: initialCategory } = useLocalSearchParams<{ category?: string }>();
  const [category, setCategory] = useState<string | undefined>(initialCategory);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [selectedAd, setSelectedAd] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const filteredAds = announcements.filter((item) => !category || item.category === category);
  const adCount = filteredAds.length;
  
  // Ładowanie ogłoszeń
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

  return (
    <View style={styles.container}>
     
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{category} ({adCount})</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {['Szkoła podstawowa', 'Szkoła ponadpodstawowa', 'Szkoła policealna'].map((level, index) => (
            <View key={index} style={styles.categoryItem}>
              <Text style={styles.categoryText}>{level}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

    
    <FlatList
      data={announcements.filter((item) => !category || item.category === category)}
      keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback
            onPress={() => {
              setSelectedAd(item);
              router.push({
                pathname: '../chosenAd',
                params: { selectedAd: item.$id, category: category }
              });
            }}
          >
            <View style={styles.adCard}>
              <Text style={styles.titleText}>{item.title}</Text>
              <Text style={styles.dateText}>{new Date(item.date).toLocaleDateString()}</Text>
            </View>
          </TouchableWithoutFeedback>
        )}
        ListEmptyComponent={
          !loading && (
            <Text style={styles.emptyText}>Brak ogłoszeń dla tej kategorii</Text>
          )
        }
        contentContainerStyle={styles.listContainer}
      />

      
      <Text style={styles.backText} onPress={() => router.push({ pathname: '../home' })}>
        Powrót
      </Text>
    </View>
  );
};

export default AdsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
  },
  headerContainer: {
    width: '100%',
    backgroundColor: '#bfa7cc',
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius:15,
    paddingBottom:20,
    paddingTop:60,
  
  },
  headerText: {
    marginLeft:23,
    fontSize: 20,
    color: 'black',
    fontWeight: '400',
  },
  categoryScroll: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  categoryItem: {
    backgroundColor: '#b49fbf',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius:18,
    marginHorizontal: 8,
    borderWidth:2,
    borderColor:'black',
  },
  categoryText: {
    color: 'black',
    fontWeight:500,
    fontSize: 16,
    textAlign: 'center',
  },
  listContainer: {
    paddingVertical: 20,
    width: '95%',
  },
  adCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '500',
    color: 'black',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 14,
    color: 'gray',
  },
  emptyText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  backText: {
    color: '#1c9e92',
    fontSize: 22,
    marginVertical: 20,
    fontWeight: '500',
  },
});
