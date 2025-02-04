import React, { useState } from 'react';
import { StyleSheet, Text, ScrollView, View, Image, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; 
import { createUser } from "#/lib/appwrite"; 
import ButtonComponent from '@/components/Buttons'; 
import { useGlobalContext } from "#/context/GlobalProvider";

import { Link, router } from "expo-router";
import { LoginData, checkData } from "./auth"

const SignUp = () => {

  const [ authData, setAuthData ] = useState<LoginData>({
    email: "",
    username: "",
    phone: "",
    password: "",
    isPasswordShown: false
  });

  function updateAuthData<K extends keyof LoginData>(key: K, value: LoginData[K]) {
    console.log(key, value)
    setAuthData({ ...authData, [key]: value })
  }

  const { setUser, setIsLogged } = useGlobalContext();

  const submit = async () => {

    try {

      checkData(authData);
      const user = await createUser(
        authData.email,
        authData.password,
        authData.username,
        authData.phone
      );

      setUser(user);
      setIsLogged(true);
      router.replace("./home");
    } catch (err) {
      alert("Error" + err.message);
    }

  };

  return (
    <SafeAreaView style={{ backgroundColor: 'black', height: '100%' }}>
      <ScrollView>
        <View style={ styles.container }>
          <Image source={ require('#/assets/images/logoteachme.png')} style={ styles.logo } />
          <Text style={ styles.title }>Zarejestruj się do TeachMe</Text>
          <Text style={ styles.label }>Nazwa użytkownika</Text>
          <TextInput
            style={ styles.input }
            placeholder="Nazwa użytkownika"
            placeholderTextColor="gray"
            value={ authData.username }
            onChangeText={ text => updateAuthData("username", text) } 
          />
          <Text style={ styles.label }>Email</Text>
          <TextInput
            style={ styles.input }
            placeholder="Email"
            placeholderTextColor="gray"
            value={ authData.email }
            onChangeText={ text => updateAuthData("email", text) }
          />
          <Text style={ styles.label }>Numer telefonu</Text>
          <TextInput
            style={ styles.input }
            placeholder="Numer telefonu"
            placeholderTextColor="gray"
            value={ authData.phone }
            onChangeText={ text => updateAuthData("phone", text) }
          />

          <Text style={ styles.label }>Hasło</Text>
          <View>
            <TextInput
              style={ styles.input }
              placeholder="Hasło"
              placeholderTextColor="gray"
              value={ authData.password }
              onChangeText={ text => updateAuthData("password", text) }
              secureTextEntry={ !authData.isPasswordShown } 
            />
            

            <TouchableOpacity
              style={ styles.iconContainer }
              onPress={ () => updateAuthData("isPasswordShown", !authData.isPasswordShown) }>
              <Ionicons
                name={ authData.isPasswordShown ? 'eye' : 'eye-off' }
                size={ 24 }
                color="gray"
              />
            </TouchableOpacity>
            


          </View>

          <View style={{ alignItems: 'center', marginBottom: 20, marginTop: 35 }}>
            <ButtonComponent
              theme="start"
              label="Zarejestruj się"
              isLoading={false}
              onPress={ submit }/>

            <Text style={{ color: 'white', fontSize: 17, marginTop: 20 }}>
              Masz już konto?{ " "}

              <Link href="../(auth)/sign-in" style={{ color: '#1c9e92', fontWeight: '600' }}>
               Zaloguj się
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
    alignItems:'center',
    height: '100%',
    padding: 20,
  },
  logo: {
    width: 190,
    height: 40,
    marginLeft: 10,
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
    marginTop: 20,
  },
  input: {
    backgroundColor: 'white',
    width: 290,
    height: 50,
    borderRadius: 15,
    paddingHorizontal: 10,
    marginTop: 10,
    fontSize: 18,
  },
  iconContainer: {
    position: 'absolute',
    top: 22,
    right:10,
  },
});
