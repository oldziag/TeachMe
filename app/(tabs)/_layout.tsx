import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function TabsLayOut() {

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" backgroundColor="white" />
     
        <View style={{ flex: 1 }}>
       
            <Tabs
              screenOptions={{
                tabBarActiveTintColor: "#000000",
                tabBarInactiveTintColor: "#4A4A4A",
                tabBarActiveBackgroundColor: "#1c9e92",
                headerShadowVisible: false,
                headerTintColor: "#000000",
                headerStyle: {
                  backgroundColor: "#fff",
                  height: 90,
                },
              
                tabBarPosition: "bottom",
                tabBarStyle: {
                backgroundColor: "#1c9e92",

                },
              }}
            >
              <Tabs.Screen
                name="home"
                options={{
                  headerShown:false,
                  tabBarLabel: "Strona główna",
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
                name="messageList"
                options={{
                  tabBarLabel: "Wiadomości",
                  headerShown:false,
                  tabBarIcon: ({ focused, color }) => (
                    <Ionicons
                      name={
                        focused
                          ? "mail"
                          : "mail-outline"
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
                  headerShown:false,
                  tabBarLabel: "Profil",
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
