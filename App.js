import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import * as MediaLibrary from 'expo-media-library';
import appConfig from './app-config';

export default function App() {
 // prod ou devLocal (changer ip si devLocal dans app-config.js)
 const uri = appConfig.prod;
 const [modalVisible, setModalVisible] = useState(false);
 const [permissionsGranted, setPermissionsGranted] = useState(false);

 useEffect(() => {
  checkPermissions();
 }, []);

 const checkPermissions = async () => {
  const { status: readStatus } = await MediaLibrary.getPermissionsAsync(false);
  const { status: writeStatus } = await MediaLibrary.getPermissionsAsync(true);

  if (readStatus === 'granted' && writeStatus === 'granted') {
   setPermissionsGranted(true);
  } else {
   setModalVisible(true);
  }
 };

 const requestPermissions = async () => {
  const { status: readStatus } = await MediaLibrary.requestPermissionsAsync(false);
  const { status: writeStatus } = await MediaLibrary.requestPermissionsAsync(true);

  if (readStatus === 'granted' && writeStatus === 'granted') {
   setPermissionsGranted(true);
   setModalVisible(false);
  } else {
   alert('Permission not granted. The app may not work correctly.');
  }
 };

 const handleShouldStartLoadWithRequest = (request) => {
  const { url } = request;

  // Allow the WebView to load the initial URL
  if (url === uri) {
   return true;
  }

  // Allow the WebView to load external URLs
  if (url.startsWith('http') || url.startsWith('https')) {
   return true;
  }

  // Block all other URLs (for example, mailto:, tel:, etc.)
  return false;
 };

 return (
   <View style={styles.container}>
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
       setModalVisible(!modalVisible);
      }}
    >
     <View style={styles.modalView}>
      <Text style={styles.modalText}>
       A2Box nécessite l'accès à vos fichiers pour que vous puissiez les partager sur vos écrans via l'application.
      </Text>
      <Image source={require('./assets/icon.png')} style={styles.image} />
      <TouchableOpacity
        style={[styles.button, styles.buttonClose]}
        onPress={requestPermissions}
      >
       <Text style={styles.textStyle}>Autoriser</Text>
      </TouchableOpacity>
     </View>
    </Modal>

    {permissionsGranted && (
      <WebView
        source={{ uri: uri }}
        style={styles.webview}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scalesPageToFit={false}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
        injectedJavaScript={`
            const meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            document.getElementsByTagName('head')[0].appendChild(meta);
            const style = document.createElement('style');
            style.innerHTML = 'body { overflow-x: hidden; }';
            document.head.appendChild(style);
          `}
      />
    )}

    <StatusBar style="auto" />
   </View>
 );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  paddingTop: Constants.statusBarHeight,
  width: '100%',
  overflow: 'hidden',
 },
 webview: {
  flex: 1,
  width: '100%',
 },
 modalView: {
  marginTop: "auto",
  marginBottom: "auto",
  margin: 20,
  backgroundColor: 'white',
  borderRadius: 20,
  padding: 35,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: {
   width: 0,
   height: 2
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5
 },
 button: {
  borderRadius: 20,
  padding: 10,
  elevation: 2
 },
 buttonClose: {
  backgroundColor: '#2196F3',
 },
 textStyle: {
  color: 'white',
  fontWeight: 'bold',
  textAlign: 'center',
  margin: 5
 },
 modalText: {
  marginBottom: 15,
  textAlign: 'center'
 },
  image: {
    width: 80,
    height: 80,
    padding: 15
  }
});
