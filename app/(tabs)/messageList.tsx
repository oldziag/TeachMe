import { Text, View, StyleSheet, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { getMessages, getUsers, getUsername, getAvatar, Message } from 'lib/appwrite'; 
import { useGlobalContext } from "../../context/GlobalProvider";
import { Ionicons } from '@expo/vector-icons';

type User = {
  userId: string;
  username: string;
  avatar: string;
};

export default function ChatScreen() {
  const { user } = useGlobalContext();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState<string>('');
  
  
//Wyświetla  listę użytkowników z bazy
  useEffect(() => {
    (async () => {
      try {
        const usersData = await getUsers();
        const usersList = await Promise.all(
          usersData.map(async (u: any) => ({
            userId: u.userId,
            username: await getUsername(u.userId),
            avatar: await getAvatar(u.userId),
          }))
        );
        setUsers(usersList);
      } catch (error) {
        console.error("Błąd pobierania użytkowników:", error);
      }
    })();
  }, []);

  //Pobiera wiadomości między zalogowanym użytkownikiem a tym, z którym wyświetla czat
  useEffect(() => {
    if (!selectedUser) return;
    const fetchMessages = async () => {
      try {
        setMessages(await getMessages(user.userId, selectedUser.userId));
      } catch (error) {
        console.error("Błąd pobierania wiadomości:", error);
      }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 1000);
    return () => clearInterval(interval);
  }, [selectedUser]);

  //Wysyłanie wiadomości
  const sendMessage = async () => {
    if (!messageText.trim() || !selectedUser) return;
    try {
      await Message(user.userId, selectedUser.userId, messageText);
      setMessageText('');
    } catch (error) {
      console.error("Błąd wysyłania wiadomości:", error);
    }
  };

  //Okno do wybierania użytkowników
  const UserList = () => (
    <View>
      <Text style={styles.header}>Wiadomości</Text>
      <FlatList
        data={users.filter((u) => u.userId !== user.userId)}
        keyExtractor={(item) => item.userId}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.userItem} onPress={() => setSelectedUser(item)}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <Text style={styles.username}>{item.username}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  //Nagłówek wiadomości ( z kim prowadzisz konwersacje )
  const ChatHeader = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => setSelectedUser(null)} style={styles.backButton}>
        <Ionicons name="arrow-back" size={30} color="white" />
      </TouchableOpacity>
      <Text style={styles.chatHeaderText}>{selectedUser?.username}</Text>
    </View>
  );

  //Styl wyświetlania wiadomości
  const MessageItem = ({ item }: { item: any }) => {
    const isSent = item.senderId === user.userId;
    const sender = users.find((u) => u.userId === item.senderId);
    return (
      <View style={[styles.messageContainer, isSent ? styles.sentContainer : styles.receivedContainer]}>
        {!isSent && sender && <Image source={{ uri: sender.avatar }} style={styles.avatarMessage} />}
        <View style={[styles.message, isSent ? styles.sent : styles.received]}>
          <Text style={styles.messageText}>{item.message}</Text>
        </View>
        {isSent && sender && <Image source={{ uri: sender.avatar }} style={styles.avatarMessage} />}
      </View>
    );
  };

  //Ekran czatu
  const ChatScreen = () => (
    <View style={{ flex: 1, width: '100%' }}>
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

  //Pokazuje dany ekran w zależności od tego, czy wybrałeś już czat, czy jeszcze jesteś na liście wszystkich użytkowników
  return <View style={styles.container}>{selectedUser ? <ChatScreen /> : <UserList />}</View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  header: { color: 'white', paddingTop: 40, fontSize: 26, paddingBottom: 30,alignSelf:'center' },
  headerContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 20 },
  chatHeaderText: { color: 'white', fontSize: 23, textAlign: 'center', flex: 1 },
  backButton: { padding: 10 },
  userItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#222' },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 15 },
  avatarMessage: { width: 35, height: 35, borderRadius: 20, marginHorizontal: 8 },
  username: { color: 'white', fontSize: 18 },
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
