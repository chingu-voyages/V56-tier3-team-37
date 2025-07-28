export type UserRole = 'guest' | 'admin' | 'surgical-team';

export interface UserWithRole {
  email: string;
  role: UserRole;
  name: string;
}

// Static list of authenticated users with their roles
export const AUTHENTICATED_USERS: UserWithRole[] = [
  {
    email: 'admin@mail.com',
    role: 'admin',
    name: 'Administrator'
  },
  {
    email: 'team1@mail.com',
    role: 'surgical-team',
    name: 'Surgical Team Member'
  },  
];

export function getUserRole(email: string): UserRole {
  const user = AUTHENTICATED_USERS.find(u => u.email === email);
  return user ? user.role : 'guest';
}

export function getUserInfo(email: string): UserWithRole | null {
  return AUTHENTICATED_USERS.find(u => u.email === email) || null;
}

export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    'guest': 0,
    'surgical-team': 1,
    'admin': 2
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

export function canAccessPatientInformation(userRole: UserRole): boolean {
  return userRole === 'admin';
}

export function canAccessPatientStatusUpdate(userRole: UserRole): boolean {
  return userRole === 'admin' || userRole === 'surgical-team';
}

export function canAccessPatientStatus(userRole: UserRole): boolean {
  return true;
}

export function canAddPatients(userRole: UserRole): boolean {
  return userRole === 'admin' || userRole === 'surgical-team';
}

export function canUpdatePatients(userRole: UserRole): boolean {
  return userRole === 'admin' || userRole === 'surgical-team';
} 