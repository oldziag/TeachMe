import { createAd, getAccount } from "lib/appwrite.js"; 
import { View, StyleSheet, Text, TextInput, Alert, ScrollView } from 'react-native';
import React, { useState } from 'react';
import ButtonComponent from '@/components/Buttons';
import { router } from 'expo-router';
import DropDownPicker from 'react-native-dropdown-picker';

export default function CreateAd() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(null);
  const [price, setPrice] = useState('');
  const [level, setLevel] = useState(null);

  const [openCategory, setOpenCategory] = useState(false);
  const [openLevel, setOpenLevel] = useState(false);

  const categories = [
    { label: 'Informatyka', value: 'Informatyka' },
    { label: 'Matematyka', value: 'Matematyka' },
    { label: 'Chemia', value: 'Chemia' },
    { label: 'Angielski', value: 'Angielski' },
    { label: 'Hiszpański', value: 'Hiszpański' },
    { label: 'Fizyka', value: 'Fizyka' },
    { label: 'Biologia', value: 'Biologia' },
  ];

  const levels = [
    { label: 'Szkoła podstawowa', value: 'Szkoła podstawowa' },
    { label: 'Szkoła ponadpodstawowa', value: 'Szkoła ponadpodstawowa' },
    { label: 'Szkoła policealna', value: 'Szkoła policealna' },
  ];

  // Tworzenie ogłoszenia
  const create = async () => {
    if (!title || !description || !category || !price || !level) {
      Alert.alert("Błąd", "Wszystkie pola są wymagane.");
      return;
    }

    try {
      const currentUser = await getAccount();
      const userId = currentUser.$id; 
      const newAd = await createAd(title, description, category, level, price, userId);

      Alert.alert("Sukces", "Ogłoszenie zostało dodane!");
      console.log("Nowe ogłoszenie:", newAd);

      setTitle('');
      setDescription('');
      setCategory(null);
      setLevel(null);
      setPrice('');
    } catch (error) {
      console.error("Błąd tworzenia ogłoszenia:", error.message || error);
      Alert.alert("Błąd", error.message || "Nie udało się dodać ogłoszenia.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Stwórz nowe ogłoszenie</Text>

      <TextInput
        style={styles.input}
        placeholder="Tytuł"
        placeholderTextColor="gray"
        value={title}
        onChangeText={setTitle}
      />
      <Text style={{color:'white' ,marginBottom:15, fontSize:17}}>Uwaga! Wyszukiwania są sugerowane na podstawie opisu, zawrzyj w nim jak najwięcej szczegółów!</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="np. Jestem pasjonatem nauczania z 3-letnim doświadczeniem w nauczaniu matematyki i programowania. Specjalizuję się w upraszczaniu skomplikowanych tematów, dostosowując lekcje do Twoich potrzeb. Niezależnie od tego, czy masz trudności z algebrą, Pythonem czy przygotowaniem do egzaminów, jestem tutaj, aby pomóc Ci odnieść sukces. Moje lekcje są interaktywne i koncentrują się na praktycznym rozwiązywaniu problemów, aby budować Twoją pewność siebie i umiejętności. Pracujmy razem, aby osiągnąć Twoje cele! "
        placeholderTextColor="gray"
        value={description}
        onChangeText={setDescription}
        multiline
      />

   
      <View style={{ zIndex: 2000 }}>
        <DropDownPicker
          open={openCategory}
          value={category}
          items={categories}
          setOpen={setOpenCategory}
          setValue={setCategory}
          placeholder="Wybierz kategorię..."
          placeholderStyle={{ color: 'gray', fontSize: 18,  }} 
          containerStyle={styles.pickerContainer}
          style={styles.picker}
          dropDownContainerStyle={styles.dropDown}
          mode="BADGE"
          onOpen={() => setOpenLevel(false)} 
        />
      </View>

     
      <View style={{ zIndex: 1000, marginTop: 10 }}>
        <DropDownPicker
          open={openLevel}
          value={level}
          items={levels}
          setOpen={setOpenLevel}
          setValue={setLevel}
          placeholder="Wybierz poziom..."
          placeholderStyle={{ color: 'gray', fontSize: 18,  }} 
          containerStyle={styles.pickerContainer}
          style={styles.picker}
          dropDownContainerStyle={styles.dropDown}
          mode="BADGE"
          onOpen={() => setOpenCategory(false)} 
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Cena za godzinę"
        placeholderTextColor="gray"
        value={price}
        keyboardType="numeric"
        onChangeText={setPrice}
      />

      <View style={{ paddingTop: 50 }}>
        <ButtonComponent theme="start" label="Dodaj" onPress={create} />
        <ButtonComponent theme="start" label="Powrót" onPress={() => router.push('/home')} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    paddingTop: 60,
  },
  heading: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 18,
  },
  textArea: {
    height: 100,
  },
  pickerContainer: {
    height: 50,
    marginBottom: 20,
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 8,
    height: 50,
  },
  dropDown: {
    backgroundColor: '#fff',
    borderRadius: 8,
  },
});
