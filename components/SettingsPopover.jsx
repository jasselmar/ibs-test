import React, { useState } from 'react';
import { StyleSheet, Refres } from 'react-native';
import { useThemeContext } from '../contexts/ThemeContext';
import { Icon, OverflowMenu, MenuItem } from '@ui-kitten/components';
import DarkModeButton from './DarkModeButton';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

const SettingsPopover = () => {
    const [visible, setVisible] = useState(false);
    const { themeMode, toggleTheme } = useThemeContext();
    const { singedIn, logout, currentUser } = useAuth();
    const navigation = useNavigation();

    const renderToggleButton = () => (
        <Icon 
        name={visible ? 'settings-2' : 'settings-2-outline'}
        width={25} height={25} 
        fill={themeMode === 'dark' ? 'white' : 'black'} 
        onPress={() => setVisible(true)} />
    )
    
    return (
        <OverflowMenu 
        visible={visible}
        anchor={renderToggleButton}
        onBackdropPress={() => setVisible(false)} >
            <MenuItem 
            title={themeMode === 'light' ? 'Dark mode' : 'Light mode' } 
            onPress={() => toggleTheme()} 
            accessoryLeft={DarkModeButton} />
            <MenuItem title={singedIn ? 'Logout' : 'Create an account' }
                    onPress={singedIn ? ( async () => { 
                        setVisible(false);
                        await logout();
                    }) 
                        : 
                        ( () => {
                            setVisible(false)
                            navigation.navigate('RegisterScreen');
                            })} />
        </OverflowMenu>
    )
}

export default SettingsPopover

const styles = StyleSheet.create({})
