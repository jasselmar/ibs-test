import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Icon, Layout } from '@ui-kitten/components';
import { useThemeContext } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import DarkModeButton from './DarkModeButton';
import SettingsPopover from './SettingsPopover';

const Header = ({ backButton, setting }) => {
    const { themeMode } = useThemeContext();
    const navigation = useNavigation();

    return (
        <Layout style={{ paddingTop: 60, 
        paddingHorizontal: 20,
        width: '100%',
        flexDirection: 'row', 
        justifyContent: backButton ? 'space-between' : 'flex-end',
        paddingBottom: 15,
        alignItems: 'center' }} level='2' >
            { backButton ? 
            <Icon 
            onPress={() => navigation.goBack()}
            name='arrow-ios-back-outline' 
            width={32} 
            height={32} 
            style={{ marginLeft: -5 }}
            fill={themeMode === 'dark' ? 'white' : 'black'} /> 
            : null}

            { setting ? 
            <SettingsPopover />
            : <DarkModeButton />
            }
        </Layout>
    )
}

export default Header

const styles = StyleSheet.create({})
