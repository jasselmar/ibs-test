import React from 'react';
import { StyleSheet } from 'react-native';
import { Spinner, Layout, Text } from '@ui-kitten/components';

const SplashScreen = () => {
    return (
        <Layout style={styles.container}>
            <Spinner />
        </Layout>
    )
}

export default SplashScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
