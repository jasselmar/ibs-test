import React from 'react'
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { NavigationContainer } from '@react-navigation/native';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import { useThemeContext } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';

import UserStack from './UserStack';

export default function AppNavigator() {
    const { themeMode } = useThemeContext();

    return (
      <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva[themeMode]} >
        <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
        <NavigationContainer >
          <AuthProvider>
            <UserStack />
          </AuthProvider>
        </NavigationContainer>
      </ApplicationProvider>
      </>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });