// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */

// import React from 'react';
// import {Button, StyleSheet, Text, View} from 'react-native';

// import ZegoUIKitPrebuiltCallService, {
//   ZegoCallInvitationDialog,
//   ZegoUIKitPrebuiltCallWaitingScreen,
//   ZegoUIKitPrebuiltCallInCallScreen,
//   ZegoSendCallInvitationButton,
// } from '@zegocloud/zego-uikit-prebuilt-call-rn';

// import {NavigationContainer, useNavigation} from '@react-navigation/native';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import CallingScreen from './CallingScreen';

// function App(props) {
//   const Stack = createNativeStackNavigator();

//   return (
//     <NavigationContainer>
//       <ZegoCallInvitationDialog />

//       <Stack.Navigator initialRouteName="HomeScreen">
//         <Stack.Screen name="HomeScreen" component={Home} />
//         <Stack.Screen name="CallingScreen" component={CallingScreen} />

//         <Stack.Screen
//           options={{headerShown: false}}
//           // DO NOT change the name
//           name="ZegoUIKitPrebuiltCallWaitingScreen"
//           component={ZegoUIKitPrebuiltCallWaitingScreen}
//         />
//         <Stack.Screen
//           options={{headerShown: false}}
//           // DO NOT change the name
//           name="ZegoUIKitPrebuiltCallInCallScreen"
//           component={ZegoUIKitPrebuiltCallInCallScreen}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// const Home = () => {
//   const navigation = useNavigation();
//   return (
//     <View style={styles.container}>
//       <Button
//         title="Call"
//         onPress={() => navigation.navigate('CallingScreen')}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });

// export default App;
// //  *******************************
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {getFirstInstallTime} from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ZegoUIKitSignalingPlugin from '@zegocloud/zego-uikit-signaling-plugin-rn';
import ZegoUIKitPrebuiltCallService, {
  ZegoCallInvitationDialog,
  ZegoUIKitPrebuiltCallWaitingScreen,
  ZegoUIKitPrebuiltCallInCallScreen,
  ZegoSendCallInvitationButton,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';

const Stack = createNativeStackNavigator();

const storeUserInfo = async info => {
  await AsyncStorage.setItem('userID', info.userID);
  await AsyncStorage.setItem('userName', info.userName);
};
const getUserInfo = async () => {
  try {
    const userID = await AsyncStorage.getItem('userID');
    const userName = await AsyncStorage.getItem('userName');
    if (userID == undefined) {
      return undefined;
    } else {
      return {userID, userName};
    }
  } catch (e) {
    return undefined;
  }
};

const onUserLogin = async (userID, userName) => {
  // const yourAppID = 1025290479;
  // const yourAppSign =
  //   'c862d7aba0208be80de5baba4c29cabc98f397e6b94ede46b43e6922d1a3350e';
  // console.log(yourAppID);
  // console.log(yourAppSign);
  return ZegoUIKitPrebuiltCallService.init(
    1025290479,
    'c862d7aba0208be80de5baba4c29cabc98f397e6b94ede46b43e6922d1a3350e', // You can get it from ZEGOCLOUD's console
    userID,
    userName,
    [ZegoUIKitSignalingPlugin],
    {
      ringtoneConfig: {
        incomingCallFileName: 'zego_incoming.mp3',
        outgoingCallFileName: 'zego_outgoing.mp3',
      },
      notifyWhenAppRunningInBackgroundOrQuit: true,
      isIOSSandboxEnvironment: true,
      androidNotificationConfig: {
        channelID: 'ZegoUIKit',
        channelName: 'ZegoUIKit',
      },
    },
  );
};

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Step 1: Config React Navigation
export default function App() {
  return (
    <NavigationContainer>
      <ZegoCallInvitationDialog />

      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />

        <Stack.Screen
          options={{headerShown: false}}
          // DO NOT change the name
          name="ZegoUIKitPrebuiltCallWaitingScreen"
          component={ZegoUIKitPrebuiltCallWaitingScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          // DO NOT change the name
          name="ZegoUIKitPrebuiltCallInCallScreen"
          component={ZegoUIKitPrebuiltCallInCallScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Step 2: Call the "ZegoUIKitPrebuiltCallService.init" method after the user login.
function LoginScreen(props) {
  const navigation = useNavigation();
  const [userID, setUserID] = useState('');
  const [userName, setUserName] = useState('');

  const loginHandler = () => {
    // Simulated login successful

    // Store user info to auto login
    storeUserInfo({userID, userName});

    // Init the call service
    onUserLogin(userID, userName).then(() => {
      // Jump to HomeScreen to make new call
      navigation.navigate('HomeScreen', {userID});
    });
  };

  useEffect(() => {
    getFirstInstallTime().then(firstInstallTime => {
      const id = String(firstInstallTime).slice(-5);
      setUserID(id);
      const name = 'user_' + id;
      setUserName(name);
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={{marginBottom: 30}}>
        <Text>appID: 1025290479</Text>
        <Text>userID: {userID}</Text>
        <Text>userName: {userName}</Text>
      </View>
      <View style={{width: 160}}>
        <Button title="Login" onPress={loginHandler}></Button>
      </View>
    </View>
  );
}

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Step 3: Configure the "ZegoSendCallInvitationButton" to enable making calls.
function HomeScreen({route, navigation}) {
  const [userID, setUserID] = useState('');
  const [invitees, setInvitees] = useState([]);
  const viewRef = useRef(null);
  const blankPressedHandle = () => {
    viewRef.current.blur();
  };
  const changeTextHandle = value => {
    setInvitees(value ? value.split(',') : []);
  };

  useEffect(() => {
    // Simulated auto login if there is login info cache
    getUserInfo().then(info => {
      if (info) {
        setUserID(info.userID);
        onUserLogin(info.userID, info.userName);
      } else {
        //  Back to the login screen if not login before
        navigation.navigate('LoginScreen');
      }
    });
  }, []);

  return (
    <TouchableWithoutFeedback onPress={blankPressedHandle}>
      <View style={styles.container}>
        <Text>Your user id: {userID}</Text>
        <View style={styles.inputContainer}>
          <TextInput
            ref={viewRef}
            style={styles.input}
            onChangeText={changeTextHandle}
            placeholder="Invitees ID, Separate ids by ','"
          />
          <ZegoSendCallInvitationButton
            invitees={invitees.map(inviteeID => {
              return {userID: inviteeID, userName: 'user_' + inviteeID};
            })}
            isVideoCall={false}
            resourceID={'zegouikit_call'}
          />
          <ZegoSendCallInvitationButton
            invitees={invitees.map(inviteeID => {
              return {userID: inviteeID, userName: 'user_' + inviteeID};
            })}
            isVideoCall={true}
            resourceID={'zegouikit_call'}
          />
        </View>
        <View style={{width: 220, marginTop: 100}}>
          <Button
            title="Back To Login Screen"
            onPress={() => {
              navigation.navigate('LoginScreen');
            }}></Button>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
  },
});

// ****************
