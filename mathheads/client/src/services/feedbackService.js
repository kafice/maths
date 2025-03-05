// src/services/feedbackService.js
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

class FeedbackService {
  constructor() {
    this.firestore = getFirestore();
    this.feedbackRef = collection(this.firestore, "userFeedback");
  }

  async submitFeedback(feedbackData) {
    const auth = getAuth();

    try {
      return await addDoc(this.feedbackRef, {
        ...feedbackData,
        userId: auth.currentUser?.uid || "anonymous",
        createdAt: serverTimestamp(),
        status: "pending",
      });
    } catch (error) {
      console.error("Error submitting feedback", error);
      throw error;
    }
  }
}

const feedbackServiceInstance = new FeedbackService();
export default feedbackServiceInstance;
