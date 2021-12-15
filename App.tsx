import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View, Text } from './components/Themed';
import { StyleSheet, TextInput, Button, ActivityIndicator, FlatList } from 'react-native';
import { Linking } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useCachedResources from './hooks/useCachedResources';
import { Input } from 'react-native-elements';
import Modal from "react-native-modal";


const dnevnikuserapi = 'https://api.dnevnik.ru/v2/users/me/context';


export default function App() {
  const userid = '';
  const isLoadingComplete = useCachedResources();
  const [token, settoken] = useState('');
  const [groupid, setgroup] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const getUserin = async () => {
    try {
     const response = await fetch(dnevnikuserapi,{
      method : 'GET',
      headers: {
        Accept :'application/json',
        'Access-Token' : token
      }
  })
      const json = await response.json();
      setData(json);
      const userid = data.personId;
      console.log('[I] ['+Date()+'] User id: '+userid + ' Group id: '+ groupid)
      const responsed = await fetch("https://api.dnevnik.ru/mobile/v2/schedule?startDate=2021-12-16&endDate=2021-12-16&personId="+userid+"&groupId="+groupid+"",{
        method : 'GET',
        headers: {
          Accept :'application/json',
          'Access-Token' : token
        }
    })
        const jsond = await responsed.json();  
        setData(jsond.Days.Schedule.Subject);

        console.log(jsond) 
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
          }
  }
  if(token ==''){

    function logging(){
      Linking.openURL('https://libn.live/token');
      console.log('[I] ['+Date()+'] Opening url with get token')
    }
    return(
      <View style={styles.container}>
      <Text style={styles.title}>Studl beta</Text>
      <Text style={styles.title}>Введите свой токен с дневника.ру</Text>
      <Text style={styles.title} onPress={()=>logging()}>Нажмите на текст, чтобы получить токен</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Input
        placeholder='Ваш токен'
        onChangeText={(token) => settoken(token)}
        leftIcon={{ type: 'font-awesome', name: 'lock' }}
      />
    </View>
    )
  } else {
   
  
    console.log(token)
    if(groupid == ''){
      const toggleModal = () => {
        setModalVisible(!isModalVisible);
      };
      
      
      return(
        <View style={styles.container}>
        <Text style={styles.title}>Шаг 2</Text>
        <Text style={styles.title}>Введите id Группы с дневника.ру</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Input
        placeholder='Ваш ID'
        onChangeText={(groupid) => setgroup(groupid)}
        leftIcon={{ type: 'font-awesome', name: 'lock' }}
      />
      <Button title="Показать данные" onPress={toggleModal} />

        <Modal isVisible={isModalVisible}>
        <View style={{ flex: 1 }}>
        <Text style={styles.title}>Данные 😊</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Text>Ваше имя {data.shortName}</Text>
        <Text>Ваше id пользователя {data.personId}</Text>
        <Text>Ваше id группы находится внизу, скопируйте его. И вставте его</Text>
        <FlatList
          data={data.eduGroups}
          renderItem={({ item }) => (
            <TextInput>{item.id_str}</TextInput>
          )}
        />
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Text>То что здесь написанно, это не значит, что дневник ру не собирает о вас данные. Ещё как он собирает..</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Text>Почему тут ничего нет ? Попробуйте нажать на кнопку обновить данные. Если ничего не произошло, проверьте токен.</Text>
        <Button style={styles.buttonupdate} title="Обновить данные" onPress={()=> {getUserin()}} />
        <Button title="Закрыть" onPress={toggleModal} />
        </View>
      </Modal>
      </View>
      )
    }else{
      console.log('[I] ['+Date()+'] User id: '+userid + ' Group id: '+ groupid)

      return(
        <View style={styles.container}>
        <Text>Привет, {data.shortName}!</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Button style={styles.buttonupdate} title="Обновить данные" onPress={()=> {getUserin()}} />

        </View>
      )
    }
  }
}
const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  buttonupdate: {
    backgroundColor: 'tomato',
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    alignItems: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

function getinformation() {
  throw new Error('Function not implemented.');
}
