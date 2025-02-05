import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { getUsername, getMessages, Message, getAvatar } from 'lib/appwrite'; // Załóżmy, że masz funkcję getAvatar
import { useGlobalContext } from "#/context/GlobalProvider";
import { Ionicons } from '@expo/vector-icons';

const AdContact = () => {
  const { adCreator } = useLocalSearchParams<{ adCreator: string }>();
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const { user } = useGlobalContext();
  const [username, setUsername] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");

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

  
    const fetchUsernameAndAvatar = async () => {
      try {
        const name = await getUsername(adCreator);
        const userAvatar = await getAvatar(adCreator); 
        setUsername(name);
        setAvatar(userAvatar); 
      } catch (error) {
        console.error("Błąd pobierania danych użytkownika:", error);
      }
    };

    fetchMessages();
    fetchUsernameAndAvatar();

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
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: messageText, senderId: user.userId }, 
      ]);
      setMessageText(""); 
    } catch (error) {
      console.error("Błąd podczas wysyłania wiadomości:", error);
    }
  };


  const ChatHeader = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.backButton}>
        <Ionicons name="arrow-back" size={30} color="white" onPress={() => router.back()} /> 
      </TouchableOpacity>
      <Text style={styles.chatHeaderText}>{username}</Text>
      <Text style={{ fontSize: 20, color: 'white', fontWeight: 500, margin: 5 }} onPress={() => router.replace("../calendar")}>
        Zajęcia
      </Text>
      <Ionicons name="calendar" color={'#1c9e92'} size={20} />
    </View>
  );


  const MessageItem = ({ item }: { item: any }) => {
    const isSent = item.senderId === user.userId;
    return (
      <View style={[styles.messageContainer, isSent ? styles.sentContainer : styles.receivedContainer]}>
        {!isSent && avatar && <Image source={{ uri: avatar }} style={styles.avatarMessage} />}
        <View style={[styles.message, isSent ? styles.sent : styles.received]}>
          <Text style={styles.messageText}>{item.message}</Text>
        </View>
        {isSent && avatar && <Image source={{ uri: avatar }} style={styles.avatarMessage} />}
      </View>
    );
  };

  return  (
    <View style={{ flex: 1, backgroundColor: '#000', padding: 20}}>
      <ChatHeader />
      <FlatList
        data={[...messages].reverse()}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <MessageItem item={item} />}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Napisz wiadomość..."
          placeholderTextColor="gray"
          value={messageText}
          onChangeText={setMessageText}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={25} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  header: { color: 'white', paddingTop: 40, fontSize: 26, paddingBottom: 30, alignSelf: 'center' },
  headerContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 20 },
  chatHeaderText: { color: 'white', fontSize: 23, textAlign: 'center', flex: 1 },
  backButton: { padding: 10 },
  avatarMessage: { width: 35, height: 35, borderRadius: 20, marginHorizontal: 8 },
  messageContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  sentContainer: { alignSelf: 'flex-end' },
  receivedContainer: { alignSelf: 'flex-start' },
  message: { padding: 13, borderRadius: 10, maxWidth: '80%' },
  sent: { backgroundColor: 'white', alignSelf: 'flex-end' },
  received: { backgroundColor: '#1c9e92', alignSelf: 'flex-start' },
  messageText: { color: 'black', fontSize: 16 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: 'white', borderRadius: 17 },
  input: { flex: 1, backgroundColor: 'white', color: 'black', padding: 10, fontSize: 17 },
  sendButton: { padding: 10 },
});

export default AdContact;
