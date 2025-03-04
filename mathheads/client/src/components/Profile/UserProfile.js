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
