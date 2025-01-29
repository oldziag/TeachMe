import { createAd, getAccount } from "lib/appwrite.js"; 
import { View, StyleSheet, Text, TextInput, Button, Alert, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import React, { useState } from 'react';
import ButtonComponent from '@/components/Buttons';
import { router } from 'expo-router';
import DropDownPicker from 'react-native-dropdown-picker';

export default function CreateAd() {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [open, setOpen] = useState(false); 
  const [items, setItems] = useState([

    { label: 'Programming', value: 'Programowanie' },
    { label: 'Math ', value: 'Matematyka' },
    { label: 'Chemistry', value: 'Chemia' },
    { label: 'English', value: 'J. Angielski' },
    { label: 'Spanish', value: 'J. Hiszpański' },
    { label: 'Physics', value: 'Fizyka' },
    { label: 'Biology', value: 'Biologia' },
  ]);

  const handleSubmit = async () => {

    if (!title || !description || !category || !price) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    try {
      const currentUser = await getAccount();
      const userId = currentUser.$id; 
      const newAd = await createAd(
        title,
        description,
        category,
        price,
        userId
      );

      Alert.alert("Success", "Advertisement created successfully!");
      console.log("New Ad:", newAd);

      setTitle('');
      setDescription('');
      setCategory('');
      setPrice('');
    } catch (error) {
      console.error("Error creating ad:", error.message || error);
      Alert.alert("Error", error.message || "Failed to create advertisement.");
    }
  };

  return (

      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Create a New Advertisement</Text>
        
        <TextInput
          style={{...styles.input, height:70}}
          placeholder="Title"
          placeholderTextColor="gray"
          value={title}
          onChangeText={setTitle}
        />
        
        <TextInput
          style={[styles.input, styles.textArea, { height: 270 }]}
          placeholder="e.g., I am a passionate tutor with 3 years of experience teaching mathematics and programming. I specialize in making complex topics easy to understand, tailoring lessons to your needs. Whether you're struggling with algebra, Python, or exam preparation, I’m here to help you succeed. My lessons are interactive and focus on practical problem-solving to build your confidence and skills. Let's work together to achieve your goals!"
          placeholderTextColor="gray"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        
        <View>
          <DropDownPicker
            open={open}
            value={category}
            items={items}
            setOpen={setOpen}
            setValue={setCategory}
            setItems={setItems}
            placeholder="Select a category..."
            placeholderStyle={{ color: 'gray', fontSize: 18,  }}  
            containerStyle={styles.pickerContainer}
            style={styles.picker}
            labelStyle={{
              color: 'gray,',
              fontSize: 18, 
            }}
           
          />
        </View>
        
        <TextInput
          style={styles.input}
          placeholder="Price per hour"
          placeholderTextColor="gray"
          value={price}
          keyboardType="numeric"
          onChangeText={setPrice}
        />
        
        <View style={{ paddingTop: 50 }}>
          <ButtonComponent theme="start" label="Submit" onPress={handleSubmit} />
          <ButtonComponent theme="start" label="Back" onPress={() => router.push('/home')} />
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
    paddingTop: 20,
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
    marginBottom: 20,
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 8,
    height: 50,
  },
});
