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
