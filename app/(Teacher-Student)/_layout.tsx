import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { useGlobalContext } from "../../context/GlobalProvider";
import { Redirect, router,Stack } from "expo-router"; 

const StudentTeacherLayout = () => {
  return (
    <>
    <Stack>
      <Stack.Screen
      name='calendar'
      options={{
        headerShown:false,
        animation: 'fade'
      }}/>


    </Stack>
    <StatusBar backgroundColor='white'/>
    </>
  )
}

export default StudentTeacherLayout
const styles = StyleSheet.create({})