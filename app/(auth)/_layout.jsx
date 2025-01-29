import { StyleSheet, Text, View } from 'react-native'
import{Stack}from 'expo-router';
import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { useGlobalContext } from "../../context/GlobalProvider";
import { Redirect, router } from "expo-router"; 

const logowanie = () => {
  const { loading, isLogged } = useGlobalContext();
  if ( isLogged) return <Redirect href="/home" />;}


const AuthLayout = () => {
  return (
    <>
    <Stack>
      <Stack.Screen
      name='sign-in'
      options={{
        headerShown:false,
        animation: 'fade'
      }}/>

      <Stack.Screen
      name='sign-up'
      options={{
        headerShown:false,
        animation: 'fade'
      }}/>

    </Stack>
    <StatusBar backgroundColor='white'/>
    </>
  )
}

export default AuthLayout
const styles = StyleSheet.create({})