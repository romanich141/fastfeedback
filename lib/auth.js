import React, { useState, useEffect, useContext, createContext } from 'react'
import { createUser } from '@/lib/db';
import firebase from '@/lib/firebase'

const errorCodes = Object.freeze({
  disabled: 'auth/user-disabled',
})

const authContext = createContext();

export function AuthProvider({ children }) {
  const auth = useProvideAuth()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
};

export const useAuth = () => {
  return useContext(authContext)
};

function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [isDisabledUser, setIsDisabledUser] = useState(false);
  
  const handleUser = (rawUser) => {
    if (rawUser) {
      const user = formatUser(rawUser);

      createUser(user.uid, user);
      setUser(user);
      return  user;
    } else {
      setUser(false);
      return false;
    }
  }

  const signinWithGitHub = () => {
    return firebase
      .auth()
      .signInWithPopup(new firebase.auth.GithubAuthProvider())
      .then((response) => handleUser(response.user))
      .catch(error => {
        if (error.code === errorCodes.disabled) {
          setIsDisabledUser(true);
        }
      })
  }

  const signout = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => handleUser(false))
  }

  useEffect(() => {
    const unsubscribe = firebase
      .auth()
      .onAuthStateChanged(handleUser)

    return () => unsubscribe()
  }, [])

  return {
    user,
    isDisabledUser,
    signinWithGitHub,
    signout,
  }
}

const formatUser = (user = {}) => {
  return {
    uid: user.uid,
    name: user.displayName,
    email: user.email,
    provider: user.providerData[0].providerId,
    protoUrl: user.providerData[0].photoURL,
  }
}