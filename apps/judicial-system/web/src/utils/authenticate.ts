export enum UserRole {
  PROCECUTOR = 'PROCECUTOR',
  JUDGE = 'JUDGE',
}

export const hasRole = (roles: string[], role: UserRole) => {
  return roles.includes(role)
}
