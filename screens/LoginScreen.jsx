import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard } from 'react-native';
import Header from '../components/Header';
import { Layout, Text } from '@ui-kitten/components';
import LoginForm from '../components/auth/LoginForm';


const LoginScreen = () => {
    return (
        <Layout style={{ flex: 1}}>
            <Header backButton={true} />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                <KeyboardAvoidingView 
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                style={styles.container} >
                    <Layout style={{ justifyContent: 'center', alignItems: 'center', width: '80%' }} >
                        <Text style={{ marginBottom: 20 }} category='h1' >Log in</Text>
                        <LoginForm />
                    </Layout>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </Layout>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
