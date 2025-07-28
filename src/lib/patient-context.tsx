export interface Patient {
  id: string;
  code: string;
  name: string;
  address: string;
  contact: string;
  status: SurgeryStatus;
}

export type SurgeryStatus =
  | 'Checked In'
  | 'Pre-Procedure'
  | 'In-Progress'
  | 'Closing'
  | 'Recovery'
  | 'Complete'
  | 'Dismissal';