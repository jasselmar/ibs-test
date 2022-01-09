import React from 'react'
import { StyleSheet } from 'react-native'
import { Layout, Icon } from '@ui-kitten/components'
import { useThemeContext } from '../contexts/ThemeContext'

const DarkModeButton = () => {
    const { themeMode, toggleTheme } = useThemeContext();
    return (
        <Layout style={{ backgroundColor: 'transparent' }} >
            { themeMode === 'light' ? 
            <Icon
            onPress={() => toggleTheme()} 
            name='moon-outline' 
            width={25}
            height={25}
            fill='black'
            /> :
            <Icon 
            onPress={() => { 
                toggleTheme();
             }} 
            name='sun-outline' 
            width={25}
            height={25}
            fill='white'
            />}
        </Layout>
    )
}

export default DarkModeButton

const styles = StyleSheet.create({})
