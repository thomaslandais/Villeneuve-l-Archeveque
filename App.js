import {StatusBar} from 'expo-status-bar';
import {StyleSheet, View} from 'react-native';
import {WebView} from 'react-native-webview';
import Constants from 'expo-constants';
import appConfig from "./app-config";

export default function App() {
    const uri = appConfig.devLocal;
    return (
        <View style={styles.container}>
            <WebView
                source={{uri: uri}}
                style={styles.webview}
                originWhitelist={[uri]}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                scalesPageToFit={false}
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
            <StatusBar style="auto"/>
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
