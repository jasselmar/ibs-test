import { useNavigation } from '@react-navigation/native';
import { useContext, createContext, useEffect, useState } from 'react';
import { auth, fs } from '../firebase/firebase';
import { Alert } from 'react-native'; 

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({children}) {

    const [currentUser, setCurrentUser] = useState();
    const [singedIn, setSingedIn] = useState(false);
    const navigation = useNavigation();

    const signup = async (email, password) => {
        return await auth.createUserWithEmailAndPassword(email, password)
    }
    
    const login = async (email, password) => {
        return await auth.signInWithEmailAndPassword(email, password)
    }

    const logout = async () => {
        return auth.signOut()
        .then( () => navigation.navigate('RegisterScreen'))
        .catch(
            error => {
                switch(error.code) {
                  default:
                    Alert.alert("An error occured trying to logout");
                }
              }
        )
    }

    function isSingedIn(user) {
        if(user === null || user === undefined ){
            setSingedIn(false);
        } else {
            setSingedIn(true)
        }
    }


/*     const getUserProfileDetails = async (user) => {
        if(!user) return;
        const userRef = fs.doc(`users/${user.uid}`);
        await userRef.get().then(documentSnapshot => {
            if(documentSnapshot.exists) {
                setCurrentUserDetails(documentSnapshot.data())
            }
        })
    } */

    const createUserProfileDocument = async (user, additionalData) => {
        if(!user) return;
        const userRef = fs.doc(`users/${user.uid}`);
        const snapShot = await userRef.get()
        
        if(!snapShot.exists) {
            createdAt = new Date();
            try {
                await userRef.set({
                    email: user.email,
                    createdAt,
                    ...additionalData
                })
            } catch(error) {
                console.log('Error creating user', error.message)
            }
            return userRef
        }
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged( user => {
            setCurrentUser(user)
            createUserProfileDocument(user)
            isSingedIn(user)
        })
        return unsubscribe
    }, [])

    const value = {
        currentUser,
        singedIn,
        signup,
        login,
        logout,
        isSingedIn,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}