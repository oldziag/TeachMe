import { Text, View, StyleSheet, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { getMessagesOnly, getUsername, getAvatar, Message, getMessages } from 'lib/appwrite'; 
import { useGlobalContext } from "../../context/GlobalProvider";
import { Ionicons } from '@expo/vector-icons';

type Usernames = { [userId: string]: string };
type Avatars = { [userId: string]: string };

export default function AboutScreen() {
  const [messages, setMessages] = useState<any[]>([]);
  const { user } = useGlobalContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [usernames, setUsernames] = useState<Usernames>({});
  const [avatars, setAvatars] = useState<Avatars>({});
  const [currentScreen, setCurrentScreen] = useState<'about' | 'chat'>('about');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null); // Store the selected user ID
  const [messageText, setMessageText] = useState<string>(''); // Store the message text

  // Fetch messages data
  useEffect(() => {
    const fetchMessagesData = async () => {
      try {
        const data = await getMessagesOnly();
        setMessages(data);
        data.forEach((message) => {
          fetchUsernameAndAvatar(message.senderId);
          fetchUsernameAndAvatar(message.receiverId);
        });
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessagesData();
    const interval = setInterval(fetchMessagesData, 1000); // Refresh messages every second
    return () => clearInterval(interval);
  }, []);

  // Send message function
  const sendMessage = async () => {
    if (!user.userId || !currentUserId || !messageText.trim()) {
      console.error("Brak wymaganych danych do wysłania wiadomości.");
      return;
    }

    try {
      await Message(user.userId, currentUserId, messageText); // Sending message to selected user
      console.log("Wiadomość wysłana!");

      // Clear message input after sending
      setMessageText('');
    } catch (error) {
      console.error("Błąd podczas wysyłania wiadomości:", error);
    }
  };

  // Fetch username and avatar for users
  const fetchUsernameAndAvatar = async (userId: string) => {
    try {
      if (!usernames[userId]) {
        const username = await getUsername(userId);
        setUsernames((prev) => ({ ...prev, [userId]: username }));
      }

      if (!avatars[userId]) {
        const avatarUrl = await getAvatar(userId);
        setAvatars((prev) => ({ ...prev, [userId]: avatarUrl }));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Group messages by user
  const groupedMessages: { [key: string]: any[] } = messages.reduce((groups, message) => {
    const groupKey = message.senderId === user.userId ? message.receiverId : message.senderId;
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(message);
    return groups;
  }, {});

  // Handle user click to view chat
  const handleUserClick = (groupKey: string) => {
    setCurrentScreen('chat');
    setCurrentUserId(groupKey);
  };

  // Render chat screen with messages
  const renderChatScreen = () => {
    if (!currentUserId) return null;
    const userMessages = messages.filter(
      (message) => 
        (message.senderId === user.userId && message.receiverId === currentUserId) ||
        (message.receiverId === user.userId && message.senderId === currentUserId)
    );

    return (
      <View style={{ width: '100%', height: '100%' }}>
        <Text style={styles.text}>{usernames[currentUserId]}</Text>

        <FlatList
          data={userMessages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View 
              style={[
                styles.messageGroup, 
                item.senderId === user.userId ? styles.sentMessage : styles.receivedMessage
              ]}
            >
              <Text style={styles.lastMessage}>{item.message}</Text>
            </View>
          )}
        />

        {/* TextInput for writing messages */}
        <TextInput 
          style={styles.textInput}
          placeholder='Napisz wiadomość...'
          placeholderTextColor='gray'
          value={messageText}
          onChangeText={setMessageText}  // Update messageText state when typing
        />
        
        {/* Send button */}
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Ionicons name='send' size={24} color={'#ffffff'} />
        </TouchableOpacity>
      </View>
    );
  };

  // Render about screen with message groups
  const renderAboutScreen = () => (
    <View style={{ width: '100%' }}>
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.text}>Messages</Text>
      </View>

      <FlatList
        style={{ width: '100%', paddingTop: 20 }}
        data={Object.entries(groupedMessages)}
        keyExtractor={(item) => item[0]}
        renderItem={({ item }) => renderMessageGroup(item[0], item[1] as any[]) }
      />
    </View>
  );

  // Render message group with username and avatar
  const renderMessageGroup = (groupKey: string, messages: any[]) => {
    const username = usernames[groupKey];
    const avatar = avatars[groupKey];
    const userMessages = messages.filter(
      (message) => message.senderId === groupKey || message.receiverId === groupKey
    );
    const lastMessage = userMessages.length > 0 ? userMessages[userMessages.length - 1] : null;

    return (
      <View style={styles.messageGroup}>
        <TouchableOpacity onPress={() => handleUserClick(groupKey)}>
          <View style={styles.userInfo}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <View style={styles.textContainer}>
              <Text style={styles.username}>{username}</Text>
              <Text style={styles.lastMessage}>{lastMessage ? lastMessage.message : 'No messages'}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {currentScreen === 'about' ? renderAboutScreen() : renderChatScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  text: {
    fontSize: 27,
    fontWeight: '400',
    color: '#fff',
    marginBottom: 40,
    paddingTop: 40,
  },
  messageGroup: {
    borderWidth: 1,
    borderColor: 'white',
    marginBottom: 20,
    borderRadius: 17,
    padding: 10,
  },
  sentMessage: {
    backgroundColor: 'white', // Green for sent messages
    alignSelf: 'flex-end', // Align to the right
  },
  receivedMessage: {
    backgroundColor: 'white', // Blue for received messages
    alignSelf: 'flex-start', // Align to the left
  },
  userInfo: {
    flexDirection: 'row', 
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  username: {
    color: 'white',
    fontSize: 20,
  },
  lastMessage: {
    color: 'gray',
    fontSize: 15,
  },
  textInput: {
    marginTop: 15,
    backgroundColor: 'white',
    width: '90%',
    height: 52,
    marginBottom: 10,
    borderRadius: 17,
    paddingHorizontal: 10,
    left: -10,
  },
  sendButton: {
    alignSelf: 'flex-end',
    bottom: 43,
    right: 20,
  },
});
