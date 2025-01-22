import { Text, View, Button, StyleSheet } from 'react-native';
import { useState } from 'react';


export default function AboutScreen() {

 
  return (
    <View style={styles.container}>
      <Text style={styles.text}>About screen</Text>
      <Text style={styles.text2}>eloelo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  text2: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
  },
});
