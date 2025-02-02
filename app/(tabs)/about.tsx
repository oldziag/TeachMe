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
  const [messages, setMessages] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState<string>('');

  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers(); 
        const usersList = await Promise.all(
          usersData.map(async (userItem: any) => ({
            userId: userItem.userId,
            username: await getUsername(userItem.userId),
            avatar: await getAvatar(userItem.userId),
          }))
        );
        setUsers(usersList);
      } catch (error) {
        console.error("Błąd pobierania użytkowników:", error);
      }
    };
    fetchUsers();
  }, []);

 
  useEffect(() => {
    if (!currentUserId) return;
    const fetchMessages = async () => {
      try {
        const data = await getMessages(user.userId, currentUserId);
        setMessages(data);
      } catch (error) {
        console.error("Błąd pobierania wiadomości:", error);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 1000);
    return () => clearInterval(interval);
  }, [currentUserId]);



  const sendMessage = async () => {
    if (!messageText.trim() || !currentUserId) return;
    try {
      await Message(user.userId, currentUserId, messageText);
      setMessageText('');
    } catch (error) {
      console.error("Błąd wysyłania wiadomości:", error);
    }
  };

  
  
  const renderUserList = () => (
    <View> 
      <View style={{alignItems:'center'}}>
        <Text style={{color:'white',paddingTop:40,fontSize:26,paddingBottom:30}}>Wiadomości</Text></View>
      
    <FlatList
    data={users.filter((u) => u.userId !== user.userId)} 
    keyExtractor={(item) => item.userId}
    renderItem={({ item }) => (
      <TouchableOpacity style={styles.userItem} onPress={() => setCurrentUserId(item.userId)}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <Text style={styles.username}>{item.username}</Text>
      </TouchableOpacity>
    )}
  /></View>
   
  );


  
  const renderChatScreen = () => (
    <View style={{ flex: 1, width: '100%' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
    
    <TouchableOpacity onPress={() => setCurrentUserId(null)} style={styles.backButton}>
      <Ionicons name="arrow-back" size={30} color="white" />
    </TouchableOpacity>
      <View style={{ position: 'absolute', left: 0, right: 0, top:20 }}>
        <Text style={{ color: 'white', fontSize: 23, textAlign: 'center' }}>
          {users.find((u) => u.userId === currentUserId)?.username}
        </Text>
      </View>
      

      </View>
      
      <View style={{ height: 40 }}></View>
  
      <FlatList
        data={[...messages].reverse()} 
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          const sender = users.find((u) => u.userId === item.senderId);
  
          return (
            <View
              style={[
                styles.messageContainer,
                item.senderId === user.userId ? styles.sentContainer : styles.receivedContainer
              ]}
            >
              {item.senderId !== user.userId && sender && ( 
                <Image source={{ uri: sender.avatar }} style={styles.avatarMessage} />
              )}
  
              <View
                style={[
                  styles.message,
                  item.senderId === user.userId ? styles.sent : styles.received
                ]}
              >
                <Text style={styles.messageText}>{item.message}</Text>
              </View>
              {item.senderId === user.userId && sender && ( 
                <Image 
                  source={{ uri: sender.avatar }} 
                  style={styles.avatarMessage} />
              )}
            </View>
          );
        }}
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
  

  return <View style={styles.container}>{currentUserId ? renderChatScreen() : renderUserList()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  sentContainer: {
    alignSelf: 'flex-end',
   
  },
  receivedContainer: {
    alignSelf: 'flex-start'
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  avatarMessage: {
    width: 35,
    height: 35,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  username: {
    color: 'white',
    fontSize: 18,
  },
  backButton: {
    padding: 10,
    marginTop:15,
    alignSelf: 'flex-start',
  },
  message: {
    
    padding: 13,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  sent: {
    backgroundColor: 'white',
    alignSelf: 'flex-end',
  },
  received: {
    backgroundColor: '#1c9e92',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: 'black',
    fontSize:16,
  },
  inputContainer: {
    marginTop:10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 17,
  },
  input: {
    flex: 1,
    backgroundColor:'white',
    color: 'black',
    padding: 10,
    fontSize:17,
  },
  sendButton: {
    padding: 10,
  },
  sentPosition: {
    alignSelf: 'flex-end',  
  },
  receivedPosition: {
    alignSelf: 'flex-start',  
  },
});
