import { View, StyleSheet, Text, Pressable, ScrollView, Image } from 'react-native';
import React from 'react';
import ButtonComponent from '@/components/Buttons';
import { router } from 'expo-router';
import SearchBox from '@/components/SearchBox';
import IconSymbol from '@/components/ui/IconSymbol';
import { Ionicons } from '@expo/vector-icons'; 

export default function Home() {
    return (
      
  <ScrollView  style={styles.Scrollcontainer}>  
    <View style={styles.container}>

      <SearchBox/>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
          {[
            { name: 'Matematyka', image: require('assets/images/matematyka.png') },
            { name: 'Fizyka', image: require('assets/images/fizyka.png') },
            { name: 'Informatyka', image: require('assets/images/informatyka.png') },
            { name: 'Biologia', image: require('assets/images/biology.png') },
            { name: 'Geografia', image: require('assets/images/geografia.png') },
            { name: 'Chemia', image: require('assets/images/chemia.png') },
            { name: 'J. Angielski', image: require('assets/images/angielski.png') },
            { name: 'J. Hiszpański', image: require('assets/images/hiszpanski.png') },
          ].map((category, index) => 
            (
            <Pressable
              key={index}
              onPress={() => router.push({ pathname: '../ads', params: { category: category.name } })}>
              <View style={styles.categoryItem}>
                <Image source={category.image} style={styles.image} />
                <Text style={styles.categoryText}>{category.name}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
    
        
      <View style={{marginTop:20 ,width:'100%',paddingHorizontal:30}}>
        <Text style={styles.hasla}>Szukasz pomocy w nauce? Odkryj tysiące<Text style={{color:'#1c9e92', fontWeight:'bold'}}> ogłoszeń</Text>  w jednym miejscu</Text> 
        <Image  style={styles.images}source={require('#/assets/images/wyszukiwarka.png')}></Image>
        <Text style={{...styles.hasla, textAlign:'right'}}>Podnieś swoje wyniki! <Text style={{color:'#1c9e92', fontWeight:'bold'}}>Korepetycje</Text> dopasowane do Twoich potrzeb</Text>
        <Image  style={{...styles.images, width:250, alignSelf:'flex-end'}}source={require('#/assets/images/korki.png')}></Image>
        <Text style={styles.hasla}>Dopasowane korepetycje dla każdego – niezależnie od poziomu twoich <Text style={{color:'#1c9e92', fontWeight:'bold'}}>umiejętności!</Text></Text>
        <Image  style={{...styles.images, width:250, alignSelf:'flex-start'}}source={require('#/assets/images/level.png')}></Image>
        <Text style={{...styles.hasla, fontSize:27, textAlign:'center', marginTop:40}}>Chcesz dzielić się wiedzą z innymi? Napisz ogłoszenie <Text style={{color:'#1c9e92', fontWeight:'bold'}}>już teraz!</Text></Text>
      </View>
    </View>
  </ScrollView>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 90,
    backgroundColor: '#000000',
    alignItems: 'center',
  },
  imageScroll: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: 'white',
    margin: 10,
  },
  images:{

    width:300,
    height:150, 
    alignSelf:'flex-start',
    borderRadius:19, 
  },
  motto: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',

  },
  hasla: {
    color: 'white',
    fontSize: 21,
    paddingBottom:30,
    paddingTop:30,

  },
  categoryText: {
    color: 'white',
    fontSize: 16,
    marginTop: 5,
    textAlign: 'center',
  },
  Scrollcontainer: {
    flex: 1,
    backgroundColor: '#000',


  },
  
});
