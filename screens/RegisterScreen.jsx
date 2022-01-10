import React from 'react'
import { StyleSheet, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native'
import { Layout, Text } from '@ui-kitten/components';
import Header from '../components/Header';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterScreen = () => {

    return (
        <Layout style={{ flex: 1}}>
            <Header backButton={false} setting={false} />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                <KeyboardAvoidingView 
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                style={styles.container} >
                    <Layout style={{ justifyContent: 'center', alignItems: 'center', width: '80%' }} >
                        <Text style={{ marginBottom: 20 }} category='h1' >Create account</Text>
                        <RegisterForm />
                    </Layout>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </Layout>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
