import React from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Spinner } from '@ui-kitten/components';
import { useAuth } from '../contexts/AuthContext';

const Splash = () => {
    return (
        <Layout style={{ width: '90%', height: '55%', borderRadius: 6, justifyContent: 'center', alignItems: 'center' }} >
            <Layout>
                <Spinner size='giant' />
            </Layout>
        </Layout>
    )
}

export default Splash

const styles = StyleSheet.create({})
