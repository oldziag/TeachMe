import React, { useState } from 'react';
import { StyleSheet, Text, ScrollView, View, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; 
import { createUser } from "../../lib/appwrite"; 
import ButtonComponent from '@/components/Buttons'; 
import { useGlobalContext } from "../../context/GlobalProvider";
import { Link, router } from "expo-router";


const SignUp = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState(''); 
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [showPassword, setShowPassword] = useState(false); 

  const submit = async () => {
    if (username === " " || email === " " || password === " ") {
      alert("Error", "Please fill in all fields");
      return; 
    }
    setSubmitting(true);
    try {
      const result = await createUser(email, password, username);
      setUser(result);
      setIsLogged(true);
      router.replace("/home");
    } 
    catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <SafeAreaView style={{ backgroundColor: 'black', height: '100%' }}>
      <ScrollView>
        <View style={styles.container}>
          <Image source={require('assets/images/logoteachme.png')} style={styles.logo} />
          <Text style={styles.title}>Sign up to TeachMe</Text>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="gray"
            value={username}
            onChangeText={setUsername} 
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="gray"
            value={email}
            onChangeText={setEmail}
          />
          <Text style={styles.label}>Password</Text>
          <View>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="gray"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword} 
            />
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye' : 'eye-off'}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          <View style={{ alignItems: 'center', marginBottom: 20, left: -13, marginTop: 35 }}>
            <ButtonComponent
              theme="start"
              label="Sign up"
              onPress={submit}/>

            <Text style={{ color: 'white', fontSize: 17, marginTop: 20 }}>
              Have an account already?{" "}

              <Link href="/sign-in" style={{ color: '#1c9e92', fontWeight: '600' }}>
                Sign in
              </Link>
              
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    height: '100%',
    padding: 20,
  },
  logo: {
    width: 190,
    height: 40,
    marginLeft: 20,
    marginTop: 20,
  },
  title: {
    color: 'white',
    padding: 30,
    fontSize: 22,
    fontWeight: '400',
    marginTop: 5,
    marginLeft:-5,
  },
  label: {
    color: 'white',
    fontSize: 17,
    fontWeight: '200',
    marginLeft: 25,
    marginTop: 20,
  },
  input: {
    backgroundColor: 'white',
    width: 290,
    height: 50,
    borderRadius: 15,
    paddingHorizontal: 10,
    marginLeft: 15,
    marginTop: 10,
    fontSize: 18,
  },
  iconContainer: {
    position: 'absolute',
    right: 0,
    top: 20,
  },
});
