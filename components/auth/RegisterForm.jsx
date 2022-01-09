import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { Layout, Input, Button, Spinner } from '@ui-kitten/components';
import { Formik, useFormik } from 'formik';
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

const RegisterSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string()
    .min(2, 'Too short!')
    .max(30, 'Too long!')
    .required('Required'),
    confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], `Passwords don't match`)
    .required('Required')
})

const RegisterForm = () => {
    const { themeMode } = useThemeContext();
    const navigation = useNavigation();
    const { signup } = useAuth();

    const { handleChange, handleBlur, handleSubmit, errors, touched, values, isSubmitting, setSubmitting } = useFormik({
        initialValues: { email: '', password: '', confirmPassword: ''},
        validationSchema: RegisterSchema,
        onSubmit: values => {
            signup(values.email, values.password)
            .then(() => {
                navigation.replace('Dashboard');
            })
            .catch(
                error => {
                  setSubmitting(false);
                  switch(error.code) {
                    case 'auth/email-already-in-use':
                      Alert.alert("There is an account with that email.");
                      break;
                    default:
                      Alert.alert("We couldn't create your account. Please try again.");
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
                    
                    <Layout style={{ marginBottom: 16 }}  >
                        <Input 
                        onChangeText={handleChange('confirmPassword')}
                        onBlur={handleBlur('confirmPassword')}
                        placeholder='Confirm password'
                        name='confirmPassword'
                        secureTextEntry
                        autoCompleteType='password'
                        status={touched.confirmPassword && errors.confirmPassword ? 'danger' : 'basic'}
                        accessoryLeft={() => <Entypo name='key' size={18} color={themeMode === 'dark' ? 'rgba(51, 102, 255, 0.48)' : 'rgba(51, 102, 255, 0.24)' } /> }
                        />
                        {touched.confirmPassword && errors.confirmPassword && <ValidationError message={errors.confirmPassword}/>}
                    </Layout>
                    

                    <Button 
                    onPress={handleSubmit} 
                    accessoryLeft={ isSubmitting ? LoadingIndicator : null } >Register</Button>
                    <Button
                    onPress={() => navigation.navigate('LoginScreen')}
                    appearance='outline'
                    style={{ marginTop: 16}} >Log in</Button>
                    <Button
                    onPress={() => navigation.navigate('Dashboard')}
                    appearance='ghost'
                    size='small'
                    style={{marginTop: 5}}>Continue as guest</Button>
            </Layout>
    )
}

export default RegisterForm

const styles = StyleSheet.create({})
