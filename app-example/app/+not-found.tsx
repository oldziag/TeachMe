import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Link, Stack,Tabs} from 'expo-router'; 

export default function NotFoundScreen() {
  return (
    <>
    <Stack.Screen options={{title:"Oops! Page not found"}}/>
    <View style={styles.container}>
    <Link href="/(tabs)/index" style={styles.button}>
  Go back to Home screen!
</Link>
    </View>
    </>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 20,
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});