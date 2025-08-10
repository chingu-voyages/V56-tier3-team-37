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
  // New fields
  firstName?: string;
  lastName?: string;
  dob?: string;
  address?: string;
  healthCareInsurance?: string;
  patientNumber?: string; // Unique 6-character patient number
  patientId?: string; // Legacy field for existing patients
  // Existing fields (for backward compatibility)
  name?: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  surgeryType?: string;
  surgeryDate?: string;
  status?: 'checked-in' | 'pre-procedure' | 'in-progress' | 'closing' | 'recovery' | 'complete' | 'dismissal';
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreatePatientData {
  // New fields
  firstName?: string;
  lastName?: string;   
  dob?: string;
  address?: string;
  healthCareInsurance?: string;
  patientNumber?: string; // Unique 6-character patient number
  patientId?: string; // Legacy field for existing patients
  name?: string; // Full name (for backward compatibility)
  email: string;
  phone: string;
  dateOfBirth?: string;
  surgeryType?: string;
  surgeryDate?: string;
  status?: 'checked-in' | 'pre-procedure' | 'in-progress' | 'closing' | 'recovery' | 'complete' | 'dismissal';
  notes?: string;
}

class PatientService {
  private collectionName = 'patients';

  // Add a new patient
  async addPatient(patientData: CreatePatientData): Promise<string> {
    try {
      const now = Timestamp.now();
      
      // Generate a unique patient number if not provided
      let finalPatientData = { ...patientData };
      if (!patientData.patientId) {
        finalPatientData.patientId = await this.generateUniquePatientNumber();
      }
      
      // Set default status to 'checked-in' if not provided
      if (!finalPatientData.status) {
        finalPatientData.status = 'checked-in';
      }
      
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...finalPatientData,
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
      
      const updateData = {
        ...updates,
        updatedAt: Timestamp.now(),
      };
      
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('PatientService: Error updating patient:', error);
      
      // Provide more specific error messages
      if ((error as any)?.code === 'permission-denied') {
        throw new Error('Permission denied: You do not have access to update this patient');
      } else if ((error as any)?.code === 'not-found') {
        throw new Error('Patient not found: The patient document does not exist');
      } else if ((error as any)?.code === 'unavailable') {
        throw new Error('Service unavailable: Please check your internet connection and try again');
      } else {
        throw new Error(`Failed to update patient: ${(error as any)?.message || 'Unknown error occurred'}`);
      }
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

  // Check if patient number exists
  async checkPatientNumberExists(patientNumber: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('patientId', '==', patientNumber)
      );
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking patient number:', error);
      throw new Error('Failed to check patient number');
    }
  }

  // Generate a unique patient number
  private async generateUniquePatientNumber(): Promise<string> {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let patientNumber = '';
    let attempts = 0;
    const maxAttempts = 10;

    do {
      patientNumber = '';
      for (let i = 0; i < 6; i++) {
        patientNumber += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      attempts++;
    } while (await this.checkPatientNumberExists(patientNumber) && attempts < maxAttempts);

    if (attempts >= maxAttempts) {
      throw new Error('Unable to generate unique patient number');
    }

    return patientNumber;
  }

  // Generate patient numbers for existing patients that don't have them
  async generatePatientNumbersForExistingPatients(): Promise<void> {
    try {
      const patients = await this.getPatients();
      const patientsWithoutNumbers = patients.filter(p => !p.patientId);
      
      for (const patient of patientsWithoutNumbers) {
        if (patient.id) {
          const patientNumber = await this.generateUniquePatientNumber();
          await this.updatePatient(patient.id, { patientId: patientNumber });
        }
      }
    } catch (error) {
      console.error('Error generating patient numbers for existing patients:', error);
      throw new Error('Failed to generate patient numbers for existing patients');
    }
  }
}

export const patientService = new PatientService(); 