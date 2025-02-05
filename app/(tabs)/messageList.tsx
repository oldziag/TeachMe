import { Text, View, StyleSheet, FlatList, Image, TouchableOpacity, TextInput, Alert} from 'react-native';
import { useState, useEffect } from 'react';
import { getMessages, getUsers, getUsername, getAvatar, Message,getRelationships } from 'lib/appwrite'; 
import { useGlobalContext } from "#/context/GlobalProvider";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

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
  const [choice, setChoice] = useState<'teachers' | 'students' | 'pending' | null>(null); 
  
  interface Relationship {
    studentID: string;
    teacherID: string;
  }
  const [relationships, setRelationships] = useState<Relationship[]>([]);  

  useEffect(() => {
    const fetchData = async () => {
      try {

        const usersData = await getUsers();
        const usersList = await Promise.all(
          usersData
            .filter((u: any) => u.userId !== user.userId)
            .map(async (u: any) => ({
              userId: u.userId,
              username: await getUsername(u.userId),
              avatar: u.avatar || await getAvatar(u.userId),
            }))
        );
        setUsers(usersList);


        const relationshipsData = await getRelationships();
        const typedRelationships = relationshipsData.map((doc: any) => ({
          studentID: doc.studentID,
          teacherID: doc.teacherID
        }));
        setRelationships(typedRelationships);
        if (selectedUser) {
          const msgs = await getMessages(user.userId, selectedUser.userId);
          setMessages(msgs);
        }
      } catch (error) {
        console.error("Błąd podczas pobierania danych", error);
      }
    };
  
    fetchData();
    
  }, [selectedUser]); 
  
  
  
  const filterUsersByRole = () => {
    if (choice === 'teachers') {
      return users.filter(user =>
        relationships.some(rel => rel.teacherID === user.userId) 
      ); 
    }
    if (choice === 'students') {
      return users.filter(user =>
        relationships.some(rel => rel.studentID === user.userId)
      );
    }
    if (choice === 'pending') {
      return users.filter(user =>
        relationships.every(rel => rel.studentID !== user.userId && rel.teacherID !== user.userId) 
      );
    } 
  };


  const sendMessage = async () => {
    if (!messageText.trim() || !selectedUser) return;
    try {
      await Message(user.userId, selectedUser.userId, messageText);
      setMessageText('');
    } catch (error) {
      console.error("Błąd wysyłania wiadomości:", error);
    }
  };


  const ChatHeader = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => setSelectedUser(null)} style={styles.backButton}>
        <Ionicons name="arrow-back" size={30} color="white" />
      </TouchableOpacity>
      <Text style={styles.chatHeaderText}>{selectedUser?.username}</Text>


      {choice=='students' &&
          <Text style={{ fontSize: 20, color: 'white', fontWeight: 500 }} 
            onPress={() => router.replace("../calendar")} >
            <Text style={{marginLeft:10, bottom:3}}>Zajęcia </Text>
          <Ionicons name="calendar" color={'#1c9e92'} size={20} />
          </Text>}
      
      {choice === 'pending' && 
          <Ionicons name="add-circle" color={'#1c9e92'} size={20} 

          />}
    </View>
  );


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


  const Choice = () => (
    <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%', flex: 1 }}>
      <Text style={{ color: '#1c9e92', fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 }}>
        Wiadomości
      </Text>
      <View style={styles.choicecontainer}>
        <Text style={styles.choice} onPress={() => setChoice('teachers')}>Twoi nauczyciele</Text>
      </View>
      <View style={styles.choicecontainer}>
        <Text style={styles.choice} onPress={() => setChoice('students')}>Twoi uczniowie</Text>
      </View>
      <View style={styles.choicecontainer}>
        <Text style={styles.choice} onPress={() => setChoice('pending')}>Oczekujące</Text>
      </View>
    </View>
  );

  const UserList = () => (
    <View>
      <TouchableOpacity onPress={() => setChoice(null)} style={styles.backButton}>
        <Ionicons name="arrow-back" size={30} color="white" />
      </TouchableOpacity>
      <Text style={styles.header}>Wiadomości</Text>
      <FlatList
        data={filterUsersByRole()}
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


  const ChatScreen = () => (
    <View style={{ flex: 1, width: '100%' }}>
      <ChatHeader />
      <FlatList  showsHorizontalScrollIndicator={false} 
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




  return <View style={styles.container}>{selectedUser ? <ChatScreen /> : choice ? <UserList /> : <Choice />}</View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  header: { color: 'white', paddingTop: 40, fontSize: 26, paddingBottom: 30, alignSelf: 'center' },
  headerContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 20,paddingHorizontal:20 },
  chatHeaderText: { color: 'white', fontSize: 23, textAlign: 'center', flex: 1 },
  backButton: { padding: 10 },
  userItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#222' },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 15 },
  avatarMessage: { width: 35, height: 35, borderRadius: 20, marginHorizontal: 8 },
  username: { color: 'white', fontSize: 18 },
  messageContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  sentContainer: { alignSelf: 'flex-end' },
  receivedContainer: { alignSelf: 'flex-start' },
  message: { padding: 13, borderRadius: 10, maxWidth: '100%' },
  sent: { backgroundColor: 'white', alignSelf: 'flex-end' },
  received: { backgroundColor: '#1c9e92', alignSelf: 'flex-start' },
  messageText: { color: 'black', fontSize: 16 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: 'white', borderRadius: 17 },
  input: { flex: 1, backgroundColor: 'white', color: 'black', padding: 10, fontSize: 17 },
  sendButton: { padding: 10 },
  choice:{ fontSize:30, color:'white'},
  choicecontainer:{ borderWidth:2, borderColor:'white', width:300, height:80,marginTop:50, borderRadius:19,  alignItems: 'center', justifyContent: 'center',}
});
