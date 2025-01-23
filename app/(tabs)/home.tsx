import { View, StyleSheet, TextInput,Text, Button } from 'react-native';
import React from 'react';
import ButtonComponent from '@/components/Buttons';
export default function Home() {
  return (
    <View style={styles.container}>
    <TextInput style={styles.input}
    placeholder='Search'
    placeholderTextColor={'gray'} >
    </TextInput>
    <Text style={styles.text}>
    Find the perfect teacher or post a tutoring ad to share your knowledge. Whether you're looking for learning support or want to help others, 
    <Text style={{color:'#1c9e92',fontWeight:600}}>TeachMe
     </Text> is the place for you.{"\n"}</Text>

    <Text style={styles.text2}>Start now and connect with people who share your passion for 
      <Text style={{color:'#1c9e92',fontWeight:600}}> learning!
    </Text> </Text>
    <View style={styles.container2}>
<ButtonComponent theme='start' label='Add your advertisement '></ButtonComponent>
</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', 
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  container2: {
top:'10%',
    backgroundColor: '#000000', 
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  input:{
    backgroundColor:'white',
    width:'90%',
    height:50,

    borderRadius:18,
    fontSize:18,
    paddingHorizontal: 15,
    position: 'absolute', 
    top: '10%',
  },
  text:{
    top: '-10%',
    color:'white',
    fontSize:20,
   textAlign: 'center',
    marginBottom:-40,
  


  },
  text2:{
    color:'white',
    fontSize:24,
   textAlign: 'center'

  }
});
