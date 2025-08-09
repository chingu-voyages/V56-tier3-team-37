import EditPatientClient from './EditPatientClient';
import { patientService } from '@/lib/patient-service';

export async function generateStaticParams() {
  try {
    const patients = await patientService.getPatients();
    return patients.map((patient) => ({
      id: patient.id || '',
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default function EditPatientPage({ params }: { params: Promise<{ id: string }> }) {
  return <EditPatientClient params={params} />;
}