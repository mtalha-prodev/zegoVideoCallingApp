import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {
  ZegoUIKitPrebuiltCall,
  ONE_ON_ONE_VIDEO_CALL_CONFIG,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';

const CallingScreen = () => {
  const userId = String(Math.floor(Math.random() * 100000));
  return (
    <View style={styles.container}>
      <ZegoUIKitPrebuiltCall
        appID={1025290479}
        appSign={
          'c862d7aba0208be80de5baba4c29cabc98f397e6b94ede46b43e6922d1a3350e'
        }
        userID={userId} // userID can be something like a phone number or the user id on your own user system.
        userName={`user_${userId}`}
        callID={'group123'} // callID can be any unique string.
        config={{
          // You can also use ONE_ON_ONE_VOICE_CALL_CONFIG/GROUP_VIDEO_CALL_CONFIG/GROUP_VOICE_CALL_CONFIG to make more types of calls.
          ...ONE_ON_ONE_VIDEO_CALL_CONFIG,
          // onOnlySelfInRoom: () => { props.navigation.navigate('HomePage') },
          // onHangUp: () => { props.navigation.navigate('HomePage') },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CallingScreen;

// *********************
