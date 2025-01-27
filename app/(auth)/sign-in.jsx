import React, { useState,useEffect } from 'react';
import { StyleSheet, Text, ScrollView, View, Image, TextInput, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link,useRouter,Router } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native'; 
import ButtonComponent from '@/components/Buttons';
import { useGlobalContext } from "../../context/GlobalProvider";
import { getCurrentUser, signIn } from "../../lib/appwrite";
import { checkActiveSession } from '../../lib/appwrite'; 



const SignIn = () => {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [showPassword, setShowPassword] = useState(false); 
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const router = useRouter();
  useEffect(() => {
      checkActiveSession(router); 
    }, []);



  const submit = async () => {
    if (email === "" || password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }
    setSubmitting(true);
    try {
      await signIn(email, password);
      const result=await getCurrentUser();
      setUser(result);
      setIsLogged(true);
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };




  return (
    <SafeAreaView style={{ backgroundColor: 'black', height: '100%' }}>
      <ScrollView>
        <View style={styles.container}>
  
          <Image
            source={require('assets/images/logoteachme.png')}
            style={styles.logo}
          />
         
          <Text style={styles.title}>Log in to TeachMe</Text>

        
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
              style={[styles.input, styles.input]} 
              placeholder="Password"
              placeholderTextColor="gray"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword} 
            />
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => setShowPassword(!showPassword)} 
            >
              <Ionicons
                name={showPassword ? 'eye' : 'eye-off'} 
                size={24}
                color="gray"
              />
            </TouchableOpacity>    
          </View>
          <View style={{alignItems:'center',marginBottom:'20',left:-13,marginTop:50}}>
              <ButtonComponent
                theme="start"
                label="Sign in"
                onPress={submit}
                isLoading={isSubmitting}/>

            <Text style={{color:'white',fontSize:17,marginTop:20}}>
              Dont'have an account?{" "}
              <Link href="/sign-up" style={{color:'#1c9e92',fontWeight:'600'}}>
              Sign up
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
    marginLeft:-10,
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
  passwordContainer: {
    position: 'relative', 
    marginLeft: 15,
    marginTop: 10,
  },

  iconContainer: {
    position: 'absolute',
    right: 0,
    top: 20,
  },
});

