export enum UserRole {
  GUEST = 'guest',
  ADMIN = 'admin',
  SURGICAL_TEAM = 'surgical-team'
}

export interface UserWithRole {
  email: string;
  role: UserRole;
  name: string;
}

// Static list of authenticated users with their roles
export const AUTHENTICATED_USERS: UserWithRole[] = [
  {
    email: 'admin@mail.com',
    role: UserRole.ADMIN,
    name: 'Administrator'
  },
  {
    email: 'team1@mail.com',
    role: UserRole.SURGICAL_TEAM,
    name: 'Surgical Team Member'
  },  
];

export function getUserRole(email: string): UserRole {
  const user = AUTHENTICATED_USERS.find(u => u.email === email);
  return user ? user.role : UserRole.GUEST;
}

export function getUserInfo(email: string): UserWithRole | null {
  return AUTHENTICATED_USERS.find(u => u.email === email) || null;
}

export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    [UserRole.GUEST]: 0,
    [UserRole.SURGICAL_TEAM]: 1,
    [UserRole.ADMIN]: 2
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

export function canAccessPatientInformation(userRole: UserRole): boolean {
  return userRole === UserRole.ADMIN;
}

export function canAccessPatientStatusUpdate(userRole: UserRole): boolean {
  return userRole === UserRole.ADMIN || userRole === UserRole.SURGICAL_TEAM;
}

export function canAccessPatientStatus(userRole: UserRole): boolean {
  return true;
}

export function canAddPatients(userRole: UserRole): boolean {
  return userRole === UserRole.ADMIN;
}

export function canUpdatePatients(userRole: UserRole): boolean {
  return userRole === UserRole.ADMIN || userRole === UserRole.SURGICAL_TEAM;
}

// New function to check if status update is allowed for Surgical Team
export function canUpdatePatientStatus(userRole: UserRole, currentStatus: string, newStatus: string): boolean {
  // Admin can do anything
  if (userRole === UserRole.ADMIN) {
    return true;
  }
  
  // Surgical Team can only move forward (ascending)
  if (userRole === UserRole.SURGICAL_TEAM) {
    const statusOrder = [
      'checked-in',
      'pre-procedure', 
      'in-progress',
      'closing',
      'recovery',
      'complete',
      'dismissal'
    ];
    
    const currentIndex = statusOrder.indexOf(currentStatus);
    const newIndex = statusOrder.indexOf(newStatus);
    
    // Only allow moving forward (newIndex > currentIndex)
    return newIndex > currentIndex;
  }
  
  return false;
} 