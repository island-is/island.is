export enum UserRole {
  PROSECUTOR = 'PROSECUTOR',
  JUDGE = 'JUDGE',
}

export const hasRole = (roles: string[], role: UserRole) => {
  return roles.includes(role)
}
