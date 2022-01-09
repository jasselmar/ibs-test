import React from 'react'
import { StyleSheet } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import { MaterialIcons } from '@expo/vector-icons';

const ValidationError = ({ message }) => {
    return (
        <Text style={{ marginTop: 8}}>
            <Layout style={{ flexDirection: 'row', alignItems: 'center'}} >
                <Text><MaterialIcons name='error' size={13} color='#DB2C66' /></Text><Text style={{ marginLeft: 3, fontSize: 13, color: '#DB2C66' }} >{message}</Text>
            </Layout>
        </Text>
    )
}

export default ValidationError

const styles = StyleSheet.create({})
