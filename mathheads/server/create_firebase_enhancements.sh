#!/bin/bash

# Create client src directory structure
mkdir -p ../client/src/components/Profile
mkdir -p ../client/src/services
mkdir -p ../client/src/context/user

# User Profile Component
cat << 'EOF' > ../client/src/components/Profile/UserProfile.js
import React, { useState, useEffect } from 'react';
import { 
  getAuth, 
  updateProfile, 
  updateEmail, 
  updatePassword 
} from 'firebase/auth';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { 
  doc, 
  setDoc, 
  getFirestore, 
  getDoc 
} from 'firebase/firestore';

const UserProfile = () => {
  const auth = getAuth();
  const storage = getStorage();
  const firestore = getFirestore();
  
  const [profile, setProfile] = useState({
    displayName: '',
    email: '',
    photoURL: '',
    bio: ''
  });

  const [profileImage, setProfileImage] = useState(null);

  // Load user profile from Firestore
  useEffect(() => {
    const loadUserProfile = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(firestore, 'userProfiles', auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          setProfile(userDoc.data());
        }
      }
    };

    loadUserProfile();
  }, [auth.currentUser]);

  // Handle profile image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const imageRef = ref(
        storage, 
        `profileImages/${auth.currentUser.uid}/${file.name}`
      );

      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      await updateProfile(auth.currentUser, { photoURL: downloadURL });
      
      const userDocRef = doc(firestore, 'userProfiles', auth.currentUser.uid);
      await setDoc(userDocRef, { 
        ...profile, 
        photoURL: downloadURL 
      }, { merge: true });

      setProfile(prev => ({ ...prev, photoURL: downloadURL }));
    } catch (error) {
      console.error('Error uploading profile image', error);
    }
  };

  // Update profile information
  const handleProfileUpdate = async () => {
    try {
      await updateProfile(auth.currentUser, { 
        displayName: profile.displayName 
      });

      const userDocRef = doc(firestore, 'userProfiles', auth.currentUser.uid);
      await setDoc(userDocRef, profile, { merge: true });

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile', error);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen p-8">
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl mb-6 text-blue-500">User Profile</h2>
        
        <div className="mb-6">
          <input 
            type="file" 
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
            id="profileImageUpload"
          />
          <label 
            htmlFor="profileImageUpload" 
            className="cursor-pointer"
          >
            {profile.photoURL ? (
              <img 
                src={profile.photoURL} 
                alt="Profile" 
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <div className="w-32 h-32 bg-blue-900 rounded-full flex items-center justify-center">
                Upload Photo
              </div>
            )}
          </label>
        </div>

        <div className="space-y-4">
          <input 
            type="text"
            placeholder="Display Name"
            value={profile.displayName}
            onChange={(e) => setProfile(prev => ({ 
              ...prev, 
              displayName: e.target.value 
            }))}
            className="w-full p-2 bg-blue-900 text-white rounded"
          />
          
          <textarea 
            placeholder="Bio"
            value={profile.bio}
            onChange={(e) => setProfile(prev => ({ 
              ...prev, 
              bio: e.target.value 
            }))}
            className="w-full p-2 bg-blue-900 text-white rounded"
          />

          <button 
            onClick={handleProfileUpdate}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
EOF

# Content Service
cat << 'EOF' > ../client/src/services/contentService.js
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';

class ContentService {
  constructor() {
    this.firestore = getFirestore();
    this.mathProblemsRef = collection(this.firestore, 'mathProblems');
  }

  // Fetch math problems by category and difficulty
  async getMathProblems(category, difficulty) {
    const querySnapshot = await getDocs(this.mathProblemsRef);
    return querySnapshot.docs
      .filter(doc => {
        const data = doc.data();
        return data.category === category && data.difficulty === difficulty;
      })
      .map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Add new math problem (admin functionality)
  async addMathProblem(problemData) {
    return await addDoc(this.mathProblemsRef, problemData);
  }

  // Update existing math problem
  async updateMathProblem(problemId, updateData) {
    const problemRef = doc(this.firestore, 'mathProblems', problemId);
    return await updateDoc(problemRef, updateData);
  }

  // Delete math problem
  async deleteMathProblem(problemId) {
    const problemRef = doc(this.firestore, 'mathProblems', problemId);
    return await deleteDoc(problemRef);
  }
}

export default new ContentService();
EOF

# User Content Service
cat << 'EOF' > ../client/src/services/userContentService.js
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

class UserContentService {
  constructor() {
    this.firestore = getFirestore();
    this.userSubmissionsRef = collection(this.firestore, 'userSubmissions');
  }

  // Submit a user-created math problem
  async submitMathProblem(problemData) {
    const auth = getAuth();
    if (!auth.currentUser) {
      throw new Error('User must be logged in to submit content');
    }

    return await addDoc(this.userSubmissionsRef, {
      ...problemData,
      userId: auth.currentUser.uid,
      createdAt: new Date(),
      status: 'pending'
    });
  }

  // Fetch user's submitted problems
  async getUserSubmissions() {
    const auth = getAuth();
    if (!auth.currentUser) {
      throw new Error('User must be logged in');
    }

    const q = query(
      this.userSubmissionsRef, 
      where('userId', '==', auth.currentUser.uid)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
  }
}

export default new UserContentService();
EOF

# Analytics Service
cat << 'EOF' > ../client/src/services/analyticsService.js
import { getAnalytics, logEvent } from 'firebase/analytics';

class AnalyticsService {
  constructor() {
    this.analytics = getAnalytics();
  }

  // Log test start event
  logTestStart(category, difficulty) {
    logEvent(this.analytics, 'test_started', {
      category,
      difficulty
    });
  }

  // Log test completion event
  logTestCompletion(category, difficulty, score) {
    logEvent(this.analytics, 'test_completed', {
      category,
      difficulty,
      score
    });
  }

  // Log user engagement
  logUserEngagement(action) {
    logEvent(this.analytics, 'user_engagement', { action });
  }
}

export default new AnalyticsService();
EOF

# Social Share Component
cat << 'EOF' > ../client/src/components/SocialShare.js
import React from 'react';

const SocialShare = ({ score, category, difficulty }) => {
  // Generate shareable text
  const shareText = `I scored ${score} in ${category} mode (${difficulty} level) on MathHeads! 🧮🚀 Challenge yourself at mathheads.com`;

  // Social share handlers
  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://mathheads.com')}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex space-x-4">
      <button 
        onClick={shareOnTwitter}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Share on Twitter
      </button>
      <button 
        onClick={shareOnFacebook}
        className="bg-blue-800 text-white px-4 py-2 rounded"
      >
        Share on Facebook
      </button>
    </div>
  );
};

export default SocialShare;
EOF

# User Context
cat << 'EOF' > ../client/src/context/user/UserContext.js
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
EOF

# Notification about installation
echo "Firebase enhancement files have been created."
echo "Next steps:"
echo "1. Install required dependencies in the client directory:"
echo "   npm install firebase"
echo "2. Configure Firebase in your project"
echo "3. Update your main App.js to use the UserProvider"
echo "4. Set up Firebase configuration in a separate file"
EOF

# Make the script executable
chmod +x create_firebase_enhancements.sh

echo "Firebase enhancements setup script created successfully."
echo "To run, use: ./create_firebase_enhancements.sh"