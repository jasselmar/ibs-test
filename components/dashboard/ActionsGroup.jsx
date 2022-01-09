import React, { useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, Platform, Alert, findNodeHandle  } from 'react-native';
import { Layout, Card, Text, Icon, Modal, CheckBox, Spinner, Input, Button } from '@ui-kitten/components';
import { useThemeContext } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';

import ValidationError from '../ValidationError';
import * as Yup from 'yup';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { auth, fs, fb } from '../../firebase/firebase';
import { useFormik } from 'formik';
import { clear } from 'react-native/Libraries/LogBox/Data/LogBoxData';

const CreateAppointmentSchema = Yup.object({
    service: Yup.string().min(2, 'Required').required('Required'),
    datetime: Yup.date().required('Required'),
    notes: Yup.string().min(2, 'Too short!').max(80, 'Too long!')
})

const LoadingIndicator = (props) => (
    <Layout style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }} >
        <Spinner size='tiny' status='basic' />
    </Layout>
)

const ActionsGroup = () => {
    const { themeMode } = useThemeContext();
    const [ createModalVisible, setCreateModalVisible ] = useState(false);
    const [ successModalVisible, setSuccessModalVisible ] = useState(false);
    
    const { singedIn, currentUser } = useAuth();
    const navigation = useNavigation();

    //CreateAppointmentModal 

    //services
    const [consultation, setConsultation] = useState();
    const [therapy, setTherapy] = useState();
    const [surgery, setSurgery] = useState();

    const [isTimePickerVisible, setTimePickerVisible] = useState(false);

    const showTimePicker = () => {
        Keyboard.dismiss();
        setTimePickerVisible(true);
    }

    const hideTimePicker = () => {
        setTimePickerVisible(false);
    }

    const handleConfirmTime = (datetime) => {
        setFieldValue('datetime', datetime, true)
        setTimePickerVisible(false);
    }

    const formatDateTime = (datetime) => {
        if(datetime === '') return
        const formattedDate = `${datetime.getFullYear()}-${datetime.getMonth() >= 12 ? datetime.getMonth() : datetime.getMonth() + 1 }-${datetime.getDate()} | ${datetime.getHours() === 0 ? 12 : (datetime.getHours() > 12 ? datetime.getHours() - 12 : datetime.getHours()) }:${datetime.getMinutes() < 10 ? '0' + datetime.getMinutes() : datetime.getMinutes()} ${ datetime.getHours() >= 12 ? 'PM' : 'AM'}`
        return formattedDate
    }

    //formik
    const { handleChange, handleBlur, handleSubmit, errors, touched, values, isSubmitting, setSubmitting, setFieldValue, setFieldTouched } = useFormik({
        initialValues: { service: '', datetime: '', notes: ''},
        validationSchema: CreateAppointmentSchema,
        onSubmit: async values => {
            return await createAppointment(values);
        }
    })

    const clearForm = () => {
        setFieldTouched('service', false, false);
        setFieldValue('service', '', false);
        setConsultation(false);
        setTherapy(false);
        setSurgery(false);

        setFieldTouched('datetime', false, false);
        setFieldValue('datetime', '', false);

        setFieldTouched('notes', false, false);
        setFieldValue('notes', '', false);
    }

    const createAppointment = async ( data ) => {
        if(!auth.currentUser) return;
        const userRef = fs.doc(`users/${auth.currentUser.uid}`);
        const userSnapShot = await userRef.get()

        if(userSnapShot.exists) {
            const appointmentId = Math.floor((1 + Math.random()) * 0x10000).toString(16)
            try {
                await fs.collection('appointments').doc(appointmentId).set({
                    appointmentId: appointmentId,
                    client: fs.doc(`users/${currentUser.uid}`),
                    requestedAt: new Date(),
                    status: 'pending',
                    notes: data.notes,
                    service: data.service,
                    datetime: data.datetime
            }).then(() => {
            setSuccessModalVisible(true);
            setCreateModalVisible(false);
            clearForm()
            userRef.update({
                appointments: fb.firestore.FieldValue.arrayUnion({
                    appointmentId: appointmentId
                })
            })
         })
            } catch(error) {
                Alert.alert('Error creating your appointment request')
                console.log(error.message, error)
            }
        }
    }

    return (
        <Layout style={{ width: '90%' }} >
            <Modal 
            style={{ width: '90%' }}
            visible={createModalVisible}
            backdropStyle={styles.backdrop}
            onBackdropPress={() => {
                setCreateModalVisible(false)
                clearForm()
                }} >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                    <KeyboardAvoidingView 
                    behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                    style={styles.container} >
                        <Layout style={{ width: '100%', paddingVertical: 30, paddingHorizontal: 25, borderRadius: 6 }} >
                            <Text category='h6' style={{ marginBottom: 16 }} >Request an appointment🗓️</Text>
                                <Layout style={{ marginBottom: 16, flexDirection: 'row' }} >
                                    <CheckBox
                                    checked={consultation}
                                    status={touched.service && errors.service ? 'danger' : 'basic'}
                                    onChange={c => {
                                        if(consultation === true) {
                                            setConsultation(false);
                                            setFieldValue('service', '', true);
                                            setFieldTouched('service', true, false);
                                            
                                        } else {
                                            setConsultation(true);
                                            setTherapy(false);
                                            setSurgery(false);
                                            setFieldValue('service', 'Consultation', true)
                                        }
                                    }} 
                                    >Consultation</CheckBox>

                                    <CheckBox
                                    checked={therapy}
                                    status={touched.service && errors.service ? 'danger' : 'basic'}
                                    onChange={c => {
                                        if(therapy === true) {
                                            setTherapy(false)
                                            setFieldValue('service', '', true)
                                            setFieldTouched('service', true, false);
                                        } else {
                                            setTherapy(c);
                                            setConsultation(false);
                                            setSurgery(false);
                                            setFieldValue('service', 'Therapy', true);
                                        }
                                    }} 
                                    >Terapia</CheckBox>

                                    <CheckBox
                                    checked={surgery}
                                    status={touched.service && errors.service ? 'danger' : 'basic'}
                                    onChange={c => {
                                        if(surgery === true) {
                                            setSurgery(false)
                                            setFieldValue('service', '', true)
                                            setFieldTouched('service', true, false);
                                        } else {
                                            setSurgery(c);
                                            setConsultation(false);
                                            setTherapy(false);
                                            setFieldValue('service', 'Surgery', true);
                                        }
                                    }} 
                                    >Surgery</CheckBox>
                                </Layout>
                                <Layout style={{ marginTop: -5, marginBottom: 11 }} >
                                    {touched.service && errors.service && <ValidationError message={errors.service}/>}
                                </Layout>

                                <Layout style={{ marginBottom: 16 }} >
                                    <Input 
                                    value={formatDateTime(values.datetime)}
                                    onFocus={showTimePicker}
                                    placeholder='Date | Time'
                                    name='datetime'
                                    status={touched.datetime && errors.datetime ? 'danger' : 'basic'}
                                    accessoryLeft={() => <Icon name='calendar' height={22} width={22} fill={themeMode === 'dark' ? 'rgba(51, 102, 255, 0.48)' : 'rgba(51, 102, 255, 0.24)' } /> }
                                    />
                                    {touched.datetime && errors.datetime && <ValidationError message={errors.datetime}/>}
                                    <DateTimePickerModal
                                    minimumDate={new Date()}
                                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                                    onConfirm={handleConfirmTime}
                                    onCancel={hideTimePicker}
                                    isVisible={isTimePickerVisible}
                                    mode='datetime'
                                    />
                                </Layout>
                                
                                <Layout style={{ marginBottom: 16 }}  >
                                    <Input 
                                    onChangeText={handleChange('notes')}
                                    onBlur={handleBlur('notes')}
                                    placeholder='Notes'
                                    name='notes'
                                    textStyle={{ minHeight: 64 }}
                                    multiline={true}
                                    caption={() => (<Text  appearance='hint' category='s2' style={{ marginTop: 5 }} >Optional</Text>)}
                                    status={touched.notes && errors.notes ? 'danger' : 'basic'}
                                    accessoryLeft={() => <Layout style={{ height: '90%', backgroundColor: 'transparent' }} ><Icon name='attach-2' height={22} width={22} fill={themeMode === 'dark' ? 'rgba(51, 102, 255, 0.48)' : 'rgba(51, 102, 255, 0.24)' } /></Layout> }
                                    />
                                    {touched.notes && errors.notes && <ValidationError message={errors.notes}/>}
                                </Layout>
                                

                                <Button 
                                onPress={handleSubmit} 
                                accessoryLeft={ isSubmitting ? LoadingIndicator : null } >Request</Button>
        </Layout>
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            </Modal>

            <Modal 
            style={{ width: '90%' }}
            visible={successModalVisible}
            backdropStyle={styles.backdrop}
            onBackdropPress={() => setSuccessModalVisible(false)} >
                <Layout style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 25, paddingHorizontal: 15, borderRadius: 6 }}>
                    <LottieView
                    autoPlay
                    loop={false}
                    onAnimationFinish={() => setSuccessModalVisible(false)}
                    speed={2}
                    style={{
                            width: 150,
                            height: 160
                        }} source={require('../../assets/success.json')} />
                    <Text category='s1' style={{ textAlign: 'center' }} >Your appointment has been requested</Text>                            
                </Layout>
            </Modal>

            <Card 
            style={{ width: '100%', marginBottom: 16 }}
            onPress={() => { singedIn ? setCreateModalVisible(true) : navigation.navigate('RegisterScreen') }} >
                    <Layout
                    style={{ 
                        flexDirection: 'row', 
                        justifyContent: 'space-between',
                        backgroundColor: 'transparent' }}>
                        <Text category='s1' >Request an appointment</Text>
                        <Icon name='plus-outline' width={22} height={22} fill={themeMode === 'dark' ? 'white' : 'black'} />
                    </Layout>
            </Card>
        </Layout>
    )
}

export default ActionsGroup

const styles = StyleSheet.create({
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
})
