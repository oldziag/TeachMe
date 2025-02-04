import React, { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { getAds } from "#/lib/appwrite";
 
function SearchBox() {
    const ref = useRef<TextInput | null>(null);
    const [text, setText] = useState("");
 
    const [announcements, setAnnouncements] = useState([]);
    const [isSelected, setIsSelected] = useState(false);

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
 
      // announcements.forEach(a => {
      //   console.log(a.description.toLowerCase().indexOf(text.toLowerCase()))
      // })
 
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
                <Text style={{ color: 'white' }}>{item.title}</Text>
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
    backgroundColor: "gray",
    backdropFilter: "blur(16px)",
    padding: 10,
    zIndex: 2,
    height: "auto",
    width: "99%",
    borderRadius: 25,
  }
});
 
 
export default SearchBox;