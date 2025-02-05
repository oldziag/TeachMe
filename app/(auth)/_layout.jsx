import { StyleSheet } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { useGlobalContext } from "#/context/GlobalProvider";
import { Redirect, Stack } from "expo-router"; 

const logowanie = () => {
  const { isLogged } = useGlobalContext();
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