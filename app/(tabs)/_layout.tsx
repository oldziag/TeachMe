import React, { useState, useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SplashScreen, Tabs,Redirect } from 'expo-router';
import { useFonts} from 'expo-font';
import { StatusBar } from 'expo-status-bar'; 
import Button from '@/components/Buttons';

export default function UkładZakładek() {

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" backgroundColor="white" />
     
        <View style={{ flex: 1 }}>
       
            <Tabs
              screenOptions={{
                tabBarActiveTintColor: "#000000",
                tabBarInactiveTintColor: "#4A4A4A",
                tabBarActiveBackgroundColor: "#808b96",
                headerShadowVisible: false,
                headerTintColor: "#000000",
                headerStyle: {
                  backgroundColor: "#fff",
                  height: 90,
                },
              
                tabBarPosition: "bottom",
                tabBarStyle: {
                  backgroundColor: "#C7C4CC",

                },
              }}
            >
              <Tabs.Screen
                name="home"
                options={{
                  tabBarLabel: "Home",
                  headerTitle: "Home",
                  tabBarIcon: ({ focused, color }) => (
                    <Ionicons
                      name={focused ? "home" : "home-outline"}
                      color={color}
                      size={30}
                    />
                  ),
                }}
              />
              <Tabs.Screen
                name="about"
                options={{
                  tabBarLabel: "About",
                  headerTitle: "About",
                  tabBarIcon: ({ focused, color }) => (
                    <Ionicons
                      name={
                        focused
                          ? "information-circle"
                          : "information-circle-outline"
                      }
                      color={color}
                      size={30}
                    />
                  ),
                }}
              />
              <Tabs.Screen
                name="profil"
                options={{
                  tabBarLabel: "Profile",
                  headerTitle: "Profile",
                  tabBarIcon: ({ focused, color }) => (
                    <Ionicons
                      name={focused ? "person" : "person-outline"}
                      color={color}
                      size={30}
                    />
                  ),
                }}
              />
            </Tabs>
        </View>

    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
