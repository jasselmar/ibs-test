import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { Layout, Input, Button, Spinner } from '@ui-kitten/components';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Entypo } from '@expo/vector-icons';
import { useThemeContext } from '../../contexts/ThemeContext';
import ValidationError from '../ValidationError';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';

const LoadingIndicator = (props) => (
    <Layout style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }} >
        <Spinner size='tiny' status='basic' />
    </Layout>
)

const LoginSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string()
    .min(2, 'Too short!')
    .max(30, 'Too long!')
    .required('Required')
})

const LoginForm = () => {
    const { themeMode } = useThemeContext();
    const navigation = useNavigation();
    const { login } = useAuth();

    const { handleChange, handleBlur, handleSubmit, errors, touched, values, isSubmitting, setSubmitting } = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: LoginSchema,
        onSubmit: values => {
            login(values.email, values.password)
            .then(() => {
                navigation.replace('Dashboard');
            })
            .catch(
                error => {
                  setSubmitting(false);
                  switch(error.code) {
                    default:
                      Alert.alert("We couldn't log into your account. Please try again.");
                      console.log(error)
                  }
                }
              )},
    })

    return (
        <Layout style={{ width: '100%' }} >
            <Layout style={{ marginBottom: 16 }} >
                <Input 
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                placeholder='Email' 
                name='email' 
                autoCompleteType='email'
                keyboardType='email-address'
                status={touched.email && errors.email ? 'danger' : 'basic'}
                accessoryLeft={() => <Entypo name='mail' size={18} color={themeMode === 'dark' ? 'rgba(51, 102, 255, 0.48)' : 	'rgba(51, 102, 255, 0.24)' } />} 
                />
                {touched.email && errors.email && <ValidationError message={errors.email}/>}
            </Layout>
            
            <Layout style={{ marginBottom: 16 }} >
                <Input 
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                placeholder='Password'
                name='password'
                secureTextEntry
                autoCompleteType='password'
                status={touched.password && errors.password ? 'danger' : 'basic'}
                accessoryLeft={() => <Entypo name='key' size={18} color={themeMode === 'dark' ? 'rgba(51, 102, 255, 0.48)' : 'rgba(51, 102, 255, 0.24)' } /> }
                />
                {touched.password && errors.password && <ValidationError message={errors.password}/>}
            </Layout>
        
            <Button 
            onPress={handleSubmit}
            accessoryLeft={ isSubmitting ? LoadingIndicator : null } >Log in</Button>
        </Layout>
)
}

export default LoginForm

const styles = StyleSheet.create({})
