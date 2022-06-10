import React, { useState, useEffect, useContext, createContext } from 'react'
import firebase from './firebase'

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
  
  const signinWithGitHub = () => {
    return firebase
      .auth()
      .signInWithPopup(new firebase.auth.GithubAuthProvider())
      .then((response) => {
        setUser(response.user)
      })
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
      .then(() => setUser(false))
  }

  useEffect(() => {
    const unsubscribe = firebase
      .auth()
      .onAuthStateChanged((user) => {
          console.log({ user })
          if (user) {
            setUser(user)
          } else {
            setUser(false)
          }
        })

    return () => unsubscribe()
  }, [])

  return {
    user,
    isDisabledUser,
    signinWithGitHub,
    signout,
  }
}