import { React, useState } from 'react';
import { StyleSheet } from 'react-native';
import { ThemeProvider } from './contexts/ThemeContext';
import AppNavigator from './AppNavigator';

import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { FontAwesome, Feather } from '@expo/vector-icons'


export default function App() {

  const [isReady, setIsReady] = useState(false);

  function cacheFonts(fonts) {
    return fonts.map(font => Font.loadAsync(font));
  }

  const loadAssets = async () => {
    const fontAssets =  await cacheFonts([FontAwesome.font, Feather.font]);
  }

  if(!isReady) {
    return (
      <AppLoading 
      startAsync={loadAssets}
      onFinish={() => setIsReady(true)}
      onError={console.warn}
      />
    )
  }
  
  return (
      <ThemeProvider>
          <AppNavigator />
      </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
