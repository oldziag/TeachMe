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
export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(ID.unique(), email, password, username);
    if (!newAccount) throw new Error("Account creation failed");

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
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error(error.message || error);
  }
}


export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.error("Error signing in:", error);
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
    if (!currentAccount) throw new Error("No account found");

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("userId", currentAccount.$id)]
    );

    if (!currentUser) throw new Error("User not found");

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
      console.log("Active session found:", user);
      router.replace("/home"); 
    }
  } catch (error) {
    console.log("No active session:", error.message);
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
      throw new Error("Price must be a valid number.");
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
    console.error("Error creating announcement:", error);
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
    console.error("Error fetching announcements:", error.message);
    throw new Error("Failed to fetch announcements");
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
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error getting username:", error);
    throw new Error(error.message || "Failed to get username");
  }
}
