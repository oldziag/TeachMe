import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Storage,
  Query
} from "react-native-appwrite";
import { Link,useRouter,Router } from 'expo-router'; 

const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.jsm.teachme",
  projectId: "67900b6f0009d2f35550",
  storageId: "67900f76001339d0bbf9",
  databaseId: "67900d48001fa02bb157",
  userCollectionId: "67900d6900172190d584",
  adCollectionId: "679296530029260196f2",
  messageCollectionId:"679e564b003e1cc0e384",
};

const client = new Client();
client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const account = new Account(client);



//Funkcje
export async function createUser(email, password, username, phonenumber) {
  try {
    const newAccount = await account.create(ID.unique(), email, password, username, phonenumber);
    if (!newAccount) throw new Error("Nie utworzono konta");

    const avatarUrl = avatars.getInitials(username);
    await signIn(email, password);
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        userId: newAccount.$id,
        email,
        username,
        phonenumber,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.error("Błąd tworzenia konta:", error);
    throw new Error(error.message || error);
  }
}


export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.error("Błąd logowania:", error);
    throw new Error(error.message || error);
  }
}



export async function getAccount() {
  try {
    const currentAccount = await account.get();
    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}


export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw new Error("Nie znaleziono użytkownika");

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("userId", currentAccount.$id)]
    );

    if (!currentUser) throw new Error("Nie znaleziono użytkownika");

    return currentUser.documents[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}


export async function checkActiveSession(router) {
  try {
    const user = await account.get();
    if (user) {
      router.replace("/home"); 
    }
  } catch (error) {
    console.log("Brak aktywnej sesji:", error.message);
  }
}


export async function signOut() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    throw new Error(error);
  }
}


export async function createAd(title, description, category, price, userId) {
  try {
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) {
      throw new Error("Cena musi być liczbą");
    }

    const newAnnouncement = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.adCollectionId,
      ID.unique(),
      {
        title,
        description,
        category,
        price: numericPrice,
        date: new Date().toISOString(),
        userId: userId,

      }
    );

    return newAnnouncement;
  } catch (error) {
    console.error("Błąd tworzenia ogłoszenia: ", error);
    throw new Error(error.message || error);
  }
}


export async function getAds() {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.adCollectionId
    );
    return response.documents; 
  } catch (error) {
    console.error("Błąd ładowania ogłoszeń:", error.message);
    throw new Error("Nie załadowano ogłoszeń");
  }
}

export async function getUsername(userId) {
  try {

    const userDocuments = await databases.listDocuments(
      appwriteConfig.databaseId, 
      appwriteConfig.userCollectionId, 
      [Query.equal("userId", userId)]
    );

    if (userDocuments.documents.length > 0) {
      const userDocument = userDocuments.documents[0];
      return userDocument.username; 
    } else {
      throw new Error("Nie znaleziono nazwy");
    }
  } catch (error) {
    console.error("Nie pobrano nazwy:", error);
    throw new Error(error.message || "Nie pobrano nazwy");
  }
}


export async function getAvatar(userId) {
  try {
 
    const userDocuments = await databases.listDocuments(
      appwriteConfig.databaseId, 
      appwriteConfig.userCollectionId, 
      [Query.equal("userId", userId)]
    );

    if (userDocuments.documents.length > 0) {
      const userDocument = userDocuments.documents[0];
      return userDocument.avatar;  
    } else {
      throw new Error("Nie znaleziono avatara");
    }
  } catch (error) {
    console.error("Nie pobrano avatara", error);
    throw new Error(error.message || "Nie pobrano avatara");
  }
}



export async function getEmail(userId) {
  try {
    const userDocuments = await databases.listDocuments(
      appwriteConfig.databaseId, 
      appwriteConfig.userCollectionId, 
      [Query.equal("userId", userId)]
    );

    if (userDocuments.documents.length > 0) {
      const userDocument = userDocuments.documents[0];
      return userDocument.email; 
    } else {
      throw new Error("Użytkownik nie znaleziony");
    }
  } catch (error) {
    console.error("Nie pobrano emaila:", error);
    throw new Error(error.message || "Nie pobrano emaila");
  }
}
export async function getPhonenumber(userId) {
  try {
    const userDocuments = await databases.listDocuments(
      appwriteConfig.databaseId, 
      appwriteConfig.userCollectionId, 
      [Query.equal("userId", userId)]
    );

    if (userDocuments.documents.length > 0) {
      const userDocument = userDocuments.documents[0];
      return userDocument.phonenumber; 
    } else {
      throw new Error("Nie znaleziono użytkownika");
    }
  } catch (error) {
    console.error("Nie pobrano numeru telefonu:", error);
    throw new Error(error.message || "Nie pobrano numeru telefonu");
  }
}



export async function Message(senderId, receiverId, message) {
  try {
   

    const newMessage = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.messageCollectionId,
      ID.unique(),
      {
        senderId,
        receiverId,
        message,
      }
    );
      
    return newMessage;
  } catch (error) {
    console.error("Błąd wysłania wiadomości:", error);
    throw new Error(error.message || error);
  }
}

export const getMessages = async (userId, receiverId) => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.messageCollectionId,
      [
        Query.or([
          Query.and([Query.equal("senderId", userId), Query.equal("receiverId", receiverId)]),
          Query.and([Query.equal("senderId", receiverId), Query.equal("receiverId", userId)]),
        ]),
        Query.orderDesc("$createdAt"), 
      ]
    );
    return response.documents;
  } catch (error) {
    console.error("Błąd załadowania wiadomości:", error);
    return [];
  }
};
export async function getUsers() {
  try {
    const usersResponse = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId
    );
    return usersResponse.documents; 
  } catch (error) {
    console.error("Błąd wczytania użytkowników:", error);
    return [];
  }
}
export const updateAd = async (adId, updatedData) => {
  try {
    const response = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.adCollectionId,
      adId,
      updatedData
    );
    return response;
  } catch (error) {
    console.error("Błąd podczas aktualizacji ogłoszenia:", error);
    throw error;
  }
}
export const deleteAd = async (adId) => {
  try {
    const response = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.adCollectionId,
      adId,
    );
    return response;
  } catch (error) {
    console.error("Błąd podczas usuwania ogłoszenia:", error);
    throw error;
  }
}

