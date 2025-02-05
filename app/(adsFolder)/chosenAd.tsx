import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router'
import { useEffect, useState } from 'react';
import { getAds, getUsername, getAvatar } from '#/lib/appwrite'; 
import ButtonComponent from '@/components/Buttons';

const chosenAd = () => {
  const [adDetails, setAdDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { selectedAd } = useLocalSearchParams<{ selectedAd: string }>();
  const { category: initialCategory } = useLocalSearchParams<{ category?: string }>();
  const fetchAdDetails = async (selectedAd: string) => {
    try {
      
      const ads = await getAds();
      const ad = ads.find((ad: any) => ad.$id === selectedAd); 
      console.log("Found ad:", ad);
      if (ad) {
        const username = await getUsername(ad.userId);
        const avatar = await getAvatar(ad.userId);
        return { ...ad, username, avatar };
      } 
    } 
    catch (error) {
    console.error( error);
    return null;
    }
  };
  
  useEffect(() => {
    if (selectedAd) {
      fetchAdDetails(selectedAd)
        .then((details) => {
          if (details) {
            setAdDetails(details);
            setLoading(false);
          }
        })
        .catch(() => setLoading(false));
    }
  }, [selectedAd]);

  if (loading) {
    return(
      <View style={{backgroundColor:'black',alignItems:'center',justifyContent:'center', flex:1}}>
      <Text style={{color:'white',fontSize:30}}>Ładowanie...</Text>
      </View>
    )
   
  }


  return (
    <ScrollView>
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <View style={styles.adCard2}>
          <ButtonComponent
              theme='back'
              label='powrót'
        
            onPress={() => {
              router.push({
                pathname: '../ads',
                params: { category: adDetails.category }
              });
            }}
          />
          
          <View style={{ alignItems: 'center', marginBottom: 10 }}> 
            {adDetails?.avatar && (
              <Image
                source={{ uri: adDetails.avatar }}
                style={styles.avatar}
                onError={(e) => console.log('Error loading image', e.nativeEvent.error)}
              />
            )}

           
            {adDetails?.username && (
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '300',
                  color: 'white',
                  textAlign: 'center',
                  left: -3,
                  marginTop: 10,
                }}
              >
                {adDetails.username}
              </Text>
            )}
          </View>

         <View style={{alignItems:'center',paddingHorizontal:20}}>
          <Text
            style={{

              fontSize: 28,
              color: 'white',
              padding: 15,
              textAlign: 'center',
              fontWeight: '700',
            }}
          >
            {adDetails?.title}
          </Text>

    
          <Text
            style={{
              fontSize: 20,
              fontWeight: '300',
              color: 'white',
              marginTop: 15,
              marginLeft: 5,
              marginRight: 5,
            }}
          >
            {adDetails?.description}
          </Text>

       
          <Text style={{ fontSize: 21, fontWeight: '600', marginTop: 90, color: 'white' }}>
            Cena:{'\n'}
          </Text>
          <Text style={{ paddingBottom: 15, fontSize: 18, color: 'white' }}>
            {adDetails?.price} zł/godzinę
          </Text>
          <Text style={{ fontSize: 21, fontWeight: '600', marginTop: 90, color: 'white' }}>
            Poziom:{'\n'}
          </Text>
          <Text style={{ paddingBottom: 15, fontSize: 18, color: 'white' }}>
            {adDetails?.level} 
          </Text>
         
          <Text style={{ fontSize: 21, fontWeight: '600', color: 'white', paddingTop: 50 }}>
            Data dodania:{'\n'}
          </Text>
          <Text style={{ paddingBottom: 15, fontSize: 18, color: 'white' }}>
            {new Date(adDetails?.date).toLocaleDateString('pl-PL', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
          </View>
         
          <View
            style={{
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'white',
              height: 60,
              width: 210,
              marginBottom: 80,
              justifyContent: 'center',
              marginTop: 30,
              borderRadius: 18,
            }}
          >
            <Text style={{ fontSize: 26, color: '#1c9e92', fontWeight: 400 }} onPress={() => router.push({ pathname: '/adContact', params: { adCreator: adDetails.userId} })}>
              Skontaktuj się
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  adCard2: {
    backgroundColor: 'black',
    height: '200%',
    width: '100%',
    paddingTop: 50,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 50,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'black',
  },
});

export default chosenAd;
