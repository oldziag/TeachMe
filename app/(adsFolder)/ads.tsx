import { StyleSheet, Text, View, FlatList, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { getAds } from '#/lib/appwrite';
import ButtonComponent from '@/components/Buttons';


const AdsScreen = () => {
  const { category: initialCategory } = useLocalSearchParams<{ category?: string }>();
  const [category, setCategory] = useState<string | undefined>(initialCategory);

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [selectedAd, setSelectedAd] = useState<any | null>(null);
  const [level, setLevel] = useState<string | undefined>(undefined);
  
  const [loading, setLoading] = useState<boolean>(true);


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
      <View>    
        <ButtonComponent
            theme='back'
            label='powrót'
             onPress={() => router.push({ pathname: '../home'})}
          />
      </View>
      <View style={styles.headerContainer}>
  
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          <Pressable onPress={resetLevel}>
            <View style={[styles.categoryItem, !level && styles.selectedCategory]}>
              <Text style={[styles.categoryText, !level && styles.selectedText]}>Wszystkie</Text>
            </View>
          </Pressable>
          {['Szkoła podstawowa', 
          'Szkoła ponadpodstawowa', 
          'Szkoła policealna'].map((levelName, index) => (
            <Pressable key={index} onPress={() => setLevel(levelName)}>

              <View style={[styles.categoryItem, level === levelName && styles.selectedCategory]}>
                <Text style={[styles.categoryText, level === levelName && styles.selectedText]}>{levelName}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    <View style={{alignItems:'center'}}>
      <FlatList
        data={filteredAds}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <Pressable
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
          </Pressable>
        )}
        ListEmptyComponent={
          !loading && <Text style={styles.emptyText}>Brak ogłoszeń dla tej kategorii i poziomu</Text>
        }
        contentContainerStyle={styles.listContainer}
      />
      </View>
      <View style={{padding:40}}></View>
    </View>
  );
};

export default AdsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop:50,
  },
  headerContainer: {
    width: '100%',
    backgroundColor: 'black',
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    paddingBottom: 20,
    paddingTop: 10,
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
    borderColor: '#1c9e92',
  },
  categoryText: {
    color: '#1c9e92',
    fontWeight: '500',
    fontSize: 16,
    textAlign: 'center',
  },
  selectedCategory: {
    borderWidth: 2,
    borderColor: '#8a9c96',
    backgroundColor: '#8a9c96',
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
