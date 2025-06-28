import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export const summaryService = {
  // Save a new summary
  async saveSummary(userId, summaryData) {
    try {
      const docRef = await addDoc(collection(db, 'summaries'), {
        userId,
        ...summaryData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      // Update user stats
      await this.updateUserStats(userId, summaryData.wordCount.original);
      
      return docRef.id;
    } catch (error) {
      console.error('Error saving summary:', error);
      throw error;
    }
  },

  // Get user summaries
  async getUserSummaries(userId, limitCount = 50) {
    try {
      const q = query(
        collection(db, 'summaries'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching summaries:', error);
      throw error;
    }
  },

  // Update summary
  async updateSummary(summaryId, updates) {
    try {
      const summaryRef = doc(db, 'summaries', summaryId);
      await updateDoc(summaryRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating summary:', error);
      throw error;
    }
  },

  // Delete summary
  async deleteSummary(summaryId) {
    try {
      await deleteDoc(doc(db, 'summaries', summaryId));
    } catch (error) {
      console.error('Error deleting summary:', error);
      throw error;
    }
  },

  // Update user statistics
  async updateUserStats(userId, wordsProcessed) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        summariesCount: increment(1),
        wordsProcessed: increment(wordsProcessed),
        lastActivity: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating user stats:', error);
      // Don't throw error for stats update failure
    }
  }
};

// Helper function for Firestore increment
function increment(value) {
  return {
    _methodName: 'FieldValue.increment',
    _delegate: value
  };
}