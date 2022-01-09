import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Text, Card } from '@ui-kitten/components';
import Header from '../components/Header';
import ActionsGroup from '../components/dashboard/ActionsGroup';
import ApointmentsCalendar from '../components/AppointmentsCalendar';
import { useAuth } from '../contexts/AuthContext';
import { fs } from '../firebase/firebase';
import SplashScreen from './SplashScreen';
import AdminAppointmentsCalendar from '../components/AdminAppointmentsCalendar';

const Dashboard = () => {
    const { currentUser, singedIn } = useAuth();
    const [ isAdmin, setIsAdmin ] = useState();
    const [ loading, setLoading ] = useState(true);

    const isUserAdmin = async () => {
        const appointmentsRef = fs.doc(`users/${currentUser?.uid}`);
        const snapShot = await appointmentsRef.get();

        if(snapShot.exists) {
            if (snapShot.data().admin) {
                setIsAdmin(true)
            } else {
                setIsAdmin(false)
            } 
        } 
        setLoading(false)
    }

    useEffect(() => {
        const unsubscribe = isUserAdmin()
        return unsubscribe
    }, [])

    if(loading) {
        return <SplashScreen />
    }

    return (
        <Layout 
        style={{ flex: 1, 
        justifyContent: 'flex-start', 
        alignItems: 'center', 
        width: '100%' }} >
            <Header backButton={false} setting={true} />
            <Layout style={{ justifyContent: 'flex-start', width: '90%', marginVertical: 20 }} >
                <Text category='h1' >Hello👋🏼 { currentUser ? 'Logged' : 'Not logged'} </Text>
            </Layout>

            {isAdmin ? 
            (
                <>
                    <Layout style={{ width: '90%', borderRadius: 6  }} >
                        <Card>
                            <Text>Select a date and you will be able to accept or decline the appointments requests for that date</Text>
                        </Card>
                    </Layout>
                    <AdminAppointmentsCalendar />
                </>
            )
            : 
            (<>
                <ActionsGroup />
                <ApointmentsCalendar />
            </>)
        }
        </Layout>
    )
}

export default Dashboard

const styles = StyleSheet.create({})
