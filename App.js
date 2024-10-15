import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import appConfig from './app-config';

export default function App() {
 // prod ou devLocal (changer ip si devLocal dans app-config.js)
 const uri = appConfig.prod;

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
});
