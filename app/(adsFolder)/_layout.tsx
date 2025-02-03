import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { useGlobalContext } from "../../context/GlobalProvider";
import { Redirect, router,Stack } from "expo-router"; 

const AdsLayout = () => {
  return (
    <>
<Stack>
    <Stack.Screen
      name='ads'
      options={{
        headerShown:false,
        animation: 'fade'
      }}/>
    <Stack.Screen
      name='chosenAd'
      options={{
        headerShown:false,
        animation: 'fade'
      }}/>
    <Stack.Screen
      name='create_ad'
      options={{
        headerShown:false,
        animation: 'fade'
      }}/>
      <Stack.Screen
      name='adContact'
      options={{
        headerShown:false,
        animation: 'fade'
      }}/>
    </Stack>
    <StatusBar backgroundColor='white'/>
    </>
  )
}

export default AdsLayout
const styles = StyleSheet.create({})