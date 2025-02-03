import { StyleSheet, Text, View, FlatList, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { getUsername, getMessages, Message } from 'lib/appwrite'; 
import { useGlobalContext } from "../../context/GlobalProvider";
import { Ionicons } from '@expo/vector-icons'; 

const AdContact = () => {
  const { adCreator } = useLocalSearchParams<{ adCreator: string }>();
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const { user } = useGlobalContext();
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    if (!user?.userId || !adCreator) return;

    const fetchMessages = async () => {
      try {
        const msgs = await getMessages(user.userId, adCreator);
        setMessages(msgs);
      } catch (error) {
        console.error("Błąd pobierania wiadomości:", error);
      }
    };

    const fetchUsername = async () => {
      try {
        const name = await getUsername(adCreator);
        setUsername(name);
      } catch (error) {
        console.error("Błąd pobierania nazwy użytkownika:", error);
      }
    };

    fetchMessages();
    fetchUsername();

    const interval = setInterval(fetchMessages, 1000);
    return () => clearInterval(interval);
  }, [user?.userId, adCreator]);

  const sendMessage = async () => {
    if (!user?.userId || !adCreator || !messageText.trim()) {
      console.error("Brak wymaganych danych do wysłania wiadomości.");
      return;
    }
    try {
      await Message(user.userId, adCreator, messageText);
      setMessageText(""); 
    } catch (error) {
      console.error("Błąd podczas wysyłania wiadomości:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons
        name="arrow-undo"
        style={{
          color: '#1c9e92',
          fontSize: 40,
          fontWeight: '600',
          left: -160
        }}
        onPress={() => router.back()} // Dodano obsługę cofania
      />

      <Text style={styles.username}>{username}</Text>

      <FlatList
        style={{ width: '100%', height: '90%' }}
        data={messages}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.senderId === user.userId ? styles.sentMessage : styles.receivedMessage
            ]}
          >
            <Text style={{ color: 'black' }}>{item.message}</Text>
          </View>
        )}
        inverted
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.sendMess}
          placeholder="Napisz wiadomość..."
          placeholderTextColor="gray"
          value={messageText}
          onChangeText={(text) => setMessageText(text)}
        />
        <Ionicons
          name="send"
          size={24}
          color="white"
          onPress={sendMessage}
          style={styles.sendIcon}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 90,
    backgroundColor: '#000000',
    alignItems: 'center',
  },
  username: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sendMess: {
    backgroundColor: 'white',
    width: '83%',
    height: 52,
    borderRadius: 17,
    paddingHorizontal: 10,
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 18,
    paddingHorizontal: 10,
  },
  sendIcon: {
    marginLeft: 10,
  },
  messageBubble: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 16,
    maxWidth: '75%',
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#1c9e92',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
  },
});

export default AdContact;
