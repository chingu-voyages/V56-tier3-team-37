export type PatientStatus = 'checked-in' | 'pre-procedure' | 'in-progress' | 'closing' | 'recovery' | 'complete' | 'dismissal';

// Status hierarchy in ascending order (forward progression)
export const STATUS_HIERARCHY: PatientStatus[] = [
  'checked-in',
  'pre-procedure', 
  'in-progress',
  'closing',
  'recovery',
  'complete',
  'dismissal'
];

/**
 * Check if a status update is allowed for Surgical Team
 * Surgical Team can only move status forward (ascending), not backward (descending)
 */
export function isStatusUpdateAllowed(
  currentStatus: PatientStatus, 
  newStatus: PatientStatus
): boolean {
  const currentIndex = STATUS_HIERARCHY.indexOf(currentStatus);
  const newIndex = STATUS_HIERARCHY.indexOf(newStatus);
  
  // Allow moving forward (ascending) or staying at same level
  return newIndex >= currentIndex;
}

/**
 * Get the next allowed statuses for a given current status
 */
export function getNextAllowedStatuses(currentStatus: PatientStatus): PatientStatus[] {
  const currentIndex = STATUS_HIERARCHY.indexOf(currentStatus);
  return STATUS_HIERARCHY.slice(currentIndex);
}

/**
 * Get the previous statuses (for reference only - not allowed for Surgical Team)
 */
export function getPreviousStatuses(currentStatus: PatientStatus): PatientStatus[] {
  const currentIndex = STATUS_HIERARCHY.indexOf(currentStatus);
  return STATUS_HIERARCHY.slice(0, currentIndex);
}
