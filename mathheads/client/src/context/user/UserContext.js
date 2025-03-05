import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  getAuth, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  getFirestore, 
  getDoc, 
  updateDoc 
} from 'firebase/firestore';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const firestore = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Fetch additional user profile data
        const userDocRef = doc(firestore, 'userProfiles', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Update user profile
  const updateUserProfile = async (profileData) => {
    if (!currentUser) return;

    const userDocRef = doc(firestore, 'userProfiles', currentUser.uid);
    await updateDoc(userDocRef, profileData);
    
    // Update local state
    setUserProfile(prev => ({ ...prev, ...profileData }));
  };

  const value = {
    currentUser,
    userProfile,
    updateUserProfile,
    loading
  };

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
