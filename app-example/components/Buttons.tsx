import { StyleSheet, View, Pressable, Text, StyleProp, ViewStyle } from 'react-native';
import { ReactNode } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';


type Props = {
  label: string;
  theme?: 'primary' | 'secondary' | 'tertiary' |'napis'|'start';
  onPress?: () => void;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function Buttons({ label, theme, onPress }: Props) {
  const handlePress = onPress || (() => alert('Button pressed'));

  if (theme === 'primary') {
    return (
      <View style={[styles.buttonContainer, styles.primaryButton]}>
        <Pressable style={[styles.button, { backgroundColor: '#fff' }]} onPress={handlePress}>
          <FontAwesome name="picture-o" size={18} color="#25292e" style={styles.buttonIcon} />
          <Text style={[styles.buttonLabel, { color: '#25292e' }]}>{label}</Text>
        </Pressable>
      </View>
    );
  } 
  
  else if (theme === 'secondary') {
    return (
      <View style={[styles.buttonContainer, styles.secondaryButton]}>
        <Pressable style={styles.button} onPress={handlePress}>
          <Ionicons name="menu" size={30} color="#000000" />
        </Pressable>
      </View>
    );
  }
   else if (theme === 'tertiary') {
    return (
      <View style={[styles.buttonContainer, styles.tertiaryButton]}>
        <Pressable style={styles.button} onPress={handlePress}>
          <Text style={[styles.buttonLabel2, { color: '#25292e' }]}>{label}</Text>
        </Pressable>
      </View>
    );
  } 
  else if (theme === 'start') {
    return (
      <View style={[styles.buttonContainer]}>
        <Pressable style={[styles.button3]} onPress={handlePress}>
          <Text style={{color:'black',fontSize:25,fontWeight:'bold'}}>{label}</Text>
        </Pressable>
      </View>
    );
  }

  else if (theme === 'napis') {
    return (

      <View style={styles.buttonContainer}>
      <Pressable style={styles.button3} onPress={handlePress}>
        <Text style={styles.napis2}>{label}</Text>
      </Pressable>
    </View>
       
    );
  }

  return (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {

    width: 320,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    margin:10,

  },
  button: {
    borderRadius: 14,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',

 
  },
  button2: {
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 14,
    width: 280,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',

  },
  button3: {
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#1c9e92',
    borderRadius: 14,
    height:70,
    top:-20,
    width:300,

  },

  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 20,
  },
  buttonLabel2: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },

  primaryButton: {
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 18,
  },
  secondaryButton: {
    marginLeft:-50,
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  tertiaryButton: {
    width: 200,
    height: 100,
    bottom: -60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#fff',
  },

  napis2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center', 
  },


 

});
