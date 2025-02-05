import React, { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { getAds } from "#/lib/appwrite";
import { useLocalSearchParams, router } from 'expo-router'
 
function SearchBox() {
    const ref = useRef<TextInput | null>(null);
    const [text, setText] = useState("");
 
    const [announcements, setAnnouncements] = useState([]);
    const [isSelected, setIsSelected] = useState(false);
    const [selectedAd, setSelectedAd] = useState("");

    const allAds = useRef([])
 
    useEffect(() => {
 
      const fetchAdsData = async () => {
        try {
          allAds.current = await getAds();
        } catch (error) {
          console.error('Błąd ładowania ogłoszeń:', error);
        }
      };
 
      fetchAdsData();
      setText("");
 
    }, []);
 
    useEffect(() => {

      if (!allAds.current) return;
 
      console.log(allAds.current)
      let zmiana = false;
 


      setAnnouncements(allAds.current.filter(a => {
        if (a.description.toLowerCase().includes(text.toLowerCase())) {
          zmiana = true;
          return true;
        } else return false
      }));

      if (!zmiana) {
        setAnnouncements([{ $id: -1, title: "Zacznij pisać, aby otrzymać sugestie" }]);
      }
 
    }, [text])
 
    return (
        <>
          <TextInput
              ref={ref}
              style={styles.input}
              placeholder="Szukaj"
              placeholderTextColor="gray"
              value={text}
              onChangeText={newText => setText(newText)}
              onFocus={() => setIsSelected(true)}
         
          />
          <Ionicons 
              name="search" 
              size={21} 
              color="gray"
              style={styles.icon}
              onPress={() => setIsSelected(!isSelected)}
          />
          <FlatList
            style={[styles.dropdown, {
              display: isSelected ? "flex" : "none",
              padding: isSelected ? 10 : 0
            } ]}
            data={announcements/*.concat([{ $id: "placeholder", title: "  " }])*/}
            keyExtractor={ ad => ad.$id }
            renderItem={({ item }) => (
              <View>
                <Text style={{ color: 'black', fontSize:20, marginBottom:20,fontWeight:500}} 
                 onPress={() => {
  
                              setSelectedAd(item);
                              router.push({
                                pathname: '../chosenAd',
                                params: { selectedAd: item.$id}
                              });
                            }}>
                {item.title}
    
                </Text>
                
              </View>
            )}
          />
        </>
    )
}
 
const styles = StyleSheet.create({
  input: {
    backgroundColor: "white",
    position: "relative",
    height: 50,
    borderRadius: 18,
    fontSize: 18,
    marginBottom: 20,
    padding: 20,
    width: "99%",
  },
  icon: {
    position: "absolute",
    right: 20,
    top: 105
  },
  dropdown: {
    position: "absolute",
    top: 150,
    backgroundColor: "white",
    backdropFilter: "blur(16px)",
    padding: 10,
    zIndex: 2,
    height: "auto",
    width: "99%",
    borderRadius: 25,
  }
});
 
 
export default SearchBox;