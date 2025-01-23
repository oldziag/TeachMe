import { createAd, getAccount } from "lib/appwrite.js"; 
import { View, StyleSheet, Text, TextInput, Button, Alert, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import React, { useState } from 'react';
import ButtonComponent from '@/components/Buttons';
import { router } from 'expo-router';

export default function CreateAd() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async () => {

    if (!title || !description || !category || !price) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    try {
      const currentUser = await getAccount();
      const userId = currentUser.$id; 
      
      console.log('Data to be sent to Appwrite:');
      console.log('Title:', title);
      console.log('Description:', description);
      console.log('Category:', category);
      console.log('Price:', price);
      console.log('User ID:', userId);
      console.log('Data creation time:', new Date().toISOString());

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
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Create a New Advertisement</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Title"
          placeholderTextColor="gray"
          value={title}
          onChangeText={setTitle}
        />
        
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          placeholderTextColor="gray"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        
        <TextInput
          style={styles.input}
          placeholder="Category"
          placeholderTextColor="gray"
          value={category}
          onChangeText={setCategory}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Price"
          placeholderTextColor="gray"
          value={price}
          keyboardType="numeric"
          onChangeText={setPrice}
        />
        
        <View style={{ paddingTop: 20 }}>
          <ButtonComponent theme="start" label="Submit" onPress={handleSubmit} />
          <ButtonComponent theme="start" label="Back" onPress={() => router.push('/home')} />
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
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
});
