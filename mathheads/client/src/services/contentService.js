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
