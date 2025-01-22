import {
    Account,
    Avatars,
    Client,
    Databases,
    ID,
    Storage,
} from "react-native-appwrite";
import { useRouter } from "expo-router";


export const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.jsm.teachme",
    projectId: "67900b6f0009d2f35550",
    storageId: "67900f76001339d0bbf9",
    databaseId: "67900d48001fa02bb157",
    userCollectionId: "67900d6900172190d584"
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

export async function createUser(email, password, username) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        );
        if (!newAccount) throw new Error("Account creation failed");

        const avatarUrl = avatars.getInitials(username);
        await signIn(email, password);
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
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
    } 
    catch (error) {
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
      if (!currentAccount) throw Error;
  
      const currentUser = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal("accountId", currentAccount.$id)]
      );
  
      if (!currentUser) throw Error;
  
      return currentUser.documents[0];
    } catch (error) {
      console.log(error);
      return null;
    }
    
  }
  export async function checkActiveSession(router) {
    try {
      const user = await account.get(); 
      if (user) {
        console.log("Active session found:", user);
        router.replace("/home"); // Przekierowanie na stronę główną
      }
    } catch (error) {
      console.log("No active session:", error.message);
    }
  }
  export async function SignOut() {
    try {
      const session = await account.deleteSession("current");
  
      return session;
    } catch (error) {
      throw new Error(error);
    }
  }