import { StyleSheet, Text, View, FlatList, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { getAds } from 'lib/appwrite';
import { Ionicons } from '@expo/vector-icons';
const AdsScreen = () => {
  const { category: initialCategory } = useLocalSearchParams<{ category?: string }>();
  const [category, setCategory] = useState<string | undefined>(initialCategory);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [selectedAd, setSelectedAd] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [level, setLevel] = useState<string | undefined>(undefined);

  const filteredAds = announcements.filter((item) => {
    const isCategoryMatch = !category || item.category === category;
    const isLevelMatch = !level || item.level === level;
    return isCategoryMatch && isLevelMatch;
  });

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


  const resetLevel = () => {
    setLevel(undefined);  
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
      <Ionicons
            name="arrow-undo"
            style={{
              alignSelf:'flex-start',
              color: '#b49fbf',
              fontSize: 40,
              fontWeight: '600',
              left: 15,
            }}
             onPress={() => router.push({ pathname: '../home'})}
          />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          <TouchableWithoutFeedback onPress={resetLevel}>
            <View style={[styles.categoryItem, !level && styles.selectedCategory]}>
              <Text style={[styles.categoryText, !level && styles.selectedText]}>Wszystkie</Text>
            </View>
          </TouchableWithoutFeedback>
          {['Szkoła podstawowa', 'Szkoła ponadpodstawowa', 'Szkoła policealna'].map((levelName, index) => (
            <TouchableWithoutFeedback key={index} onPress={() => setLevel(levelName)}>
              <View style={[styles.categoryItem, level === levelName && styles.selectedCategory]}>
                <Text style={[styles.categoryText, level === levelName && styles.selectedText]}>{levelName}</Text>
              </View>
            </TouchableWithoutFeedback>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredAds}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback
            onPress={() => {
              setSelectedAd(item);
              router.push({
                pathname: '../chosenAd',
                params: { selectedAd: item.$id, category: category, level: level }
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
          !loading && <Text style={styles.emptyText}>Brak ogłoszeń dla tej kategorii i poziomu</Text>
        }
        contentContainerStyle={styles.listContainer}
      />
      <View style={{padding:40}}></View>
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
    backgroundColor: 'black',
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    paddingBottom: 20,
    paddingTop: 60,
  },
  categoryScroll: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  categoryItem: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 18,
    marginHorizontal: 8,
    borderWidth: 2,
    borderColor: '#b49fbf',
  },
  categoryText: {
    color: '#b49fbf',
    fontWeight: '500',
    fontSize: 16,
    textAlign: 'center',
  },
  selectedCategory: {
    backgroundColor: '#b49fbf',
  },
  selectedText: {
    color: 'black',
  },
  listContainer: {
    paddingVertical: 20,
    width: '95%',
  },
  adCard: {
    backgroundColor: 'white',
    width:370,
    borderRadius: 19,
    padding: 15,
    marginBottom: 15,
    shadowColor: 'white',
    shadowOpacity: 0.7,
    shadowRadius: 5,
    elevation: 4,
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

});
