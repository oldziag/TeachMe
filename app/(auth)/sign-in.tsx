import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, ScrollView, View, Image, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons'; 
import ButtonComponent from '@/components/Buttons';
import { useGlobalContext } from "#/context/GlobalProvider";
import { getCurrentUser, signIn, checkActiveSession } from "#/lib/appwrite";
import { checkData, LoginData } from './auth';
const SignIn = () => {


  const [ authData, setAuthData ] = useState<LoginData>({
    email: "",
    password: "",
    isPasswordShown: false
  });

  function updateAuthData<K extends keyof LoginData>(key: K, value: LoginData[K]) {
    setAuthData({ ...authData, [key]: value })
  }

  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  
  const router = useRouter();
  useEffect(() => { checkActiveSession(router) }, []);

  const submit = async () => {

    try {

      checkData(authData);
      setSubmitting(true);

      await signIn(authData.email, authData.password);

      const user = await getCurrentUser();
      setUser(user);

      setIsLogged(true);
      setTimeout(() => {
        router.replace("../home");
      });
     

    } catch (err) {
      alert("Error: " + err.message);
      
    } finally {
      setSubmitting(false);
    }

  };

  return (
    <SafeAreaView style={{ backgroundColor: 'black', height: '100%' }}>
      <ScrollView>
        <View style={styles.container}>
  
          <Image
            source={require('#/assets/images/logoteachme.png')}
            style={styles.logo}
          />
         
          <Text style={styles.title}>Zaloguj się do TeachMe</Text>

        
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="gray"
            value={ authData.email }
            onChangeText={ text => updateAuthData("email", text) }
          />

  
          <Text style={styles.label}>Hasło</Text>
          <View>
            <TextInput
              style={[styles.input, styles.input]} 
              placeholder="Hasło"
              placeholderTextColor="gray"
              value={ authData.password }
              onChangeText={ text => updateAuthData("password", text) }
              secureTextEntry={ !authData.isPasswordShown } 
            />
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={ () => updateAuthData("isPasswordShown", !authData.isPasswordShown) }
            >
              <Ionicons
                name={ authData.isPasswordShown ? 'eye' : 'eye-off' }
                size={24}
                color="gray"
              />
            </TouchableOpacity>    
          </View>
          <View style={{ alignItems: 'center', marginBottom: 20, marginTop: 35 }}>
              <ButtonComponent
                theme="start"
                label="Zaloguj się"
                onPress={submit}
                isLoading={isSubmitting} 
              />

            <Text style={{color:'white',fontSize:17,marginTop:20}}>
              Nie masz konta?{" "}
              <Link href="./sign-up" style={{color:'#1c9e92',fontWeight:'600'}}>
              Zarejestruj się
              </Link>
            </Text>
          </View>  
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;


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
    marginLeft:-10,
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
  passwordContainer: {
    position: 'relative', 
    marginLeft: 15,
    marginTop: 10,
  },

  iconContainer: {
    position: 'absolute',
    top: 22,
    right:10,
  },
});

