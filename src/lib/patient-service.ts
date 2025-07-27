import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export interface Patient {
  id?: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  surgeryType: string;
  surgeryDate: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreatePatientData {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  surgeryType: string;
  surgeryDate: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
}

class PatientService {
  private collectionName = 'patients';

  // Add a new patient
  async addPatient(patientData: CreatePatientData): Promise<string> {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...patientData,
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding patient:', error);
      throw new Error('Failed to add patient');
    }
  }

  // Get all patients
  async getPatients(): Promise<Patient[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Patient[];
    } catch (error) {
      console.error('Error getting patients:', error);
      throw new Error('Failed to fetch patients');
    }
  }

  // Get patients by status
  async getPatientsByStatus(status: Patient['status']): Promise<Patient[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Patient[];
    } catch (error) {
      console.error('Error getting patients by status:', error);
      throw new Error('Failed to fetch patients');
    }
  }

  // Update a patient
  async updatePatient(id: string, updates: Partial<CreatePatientData>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating patient:', error);
      throw new Error('Failed to update patient');
    }
  }

  // Delete a patient
  async deletePatient(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting patient:', error);
      throw new Error('Failed to delete patient');
    }
  }

  // Get patient by ID
  async getPatientById(id: string): Promise<Patient | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDocs(collection(db, this.collectionName));
      
      const patientDoc = docSnap.docs.find(doc => doc.id === id);
      if (patientDoc) {
        return {
          id: patientDoc.id,
          ...patientDoc.data()
        } as Patient;
      }
      return null;
    } catch (error) {
      console.error('Error getting patient by ID:', error);
      throw new Error('Failed to fetch patient');
    }
  }
}

export const patientService = new PatientService(); 