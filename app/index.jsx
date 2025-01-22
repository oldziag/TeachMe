import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import ButtonComponent from '@/components/Buttons';
import { Redirect, router } from "expo-router";
import { useGlobalContext } from "../context/GlobalProvider";

const logowanie = () => {
  const { loading, isLogged } = useGlobalContext();
  if ( isLogged) return <Redirect href="/home" />;}

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>

      <View >
        <Image 
          source={require('assets/images/logoteachme.png')} 
          style={styles.logo}
        />
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={require('assets/images/teachmekula.png')}
          style={styles.image}
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.mainText}>
          Just start taking{"\n"}
          your{" "}
          <Text style={styles.highlightText}>notes...</Text>
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <ButtonComponent 
          theme="start" 
          label="Continue with Email"  
          onPress={() => router.push('/sign-in')}
        />
      </View>
      <StatusBar backgroundColor="black" style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  logo: {
    width: 220,
    height: 90,
    left:7,
    resizeMode: 'contain',
  },
  imageContainer: {
    flex: 3, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '246', 
    height: '258',  
    borderRadius:150,
    borderWidth:4,
    borderColor:'white',
    top:-50,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top:-70,
  },
  mainText: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  highlightText: {
    color: '#1c9e92',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
});
