import { UserRole } from '@island.is/judicial-system-web/src/graphql/schema'

export const userRoleToString = (userRole?: UserRole | null) => {
  switch (userRole) {
    case UserRole.PROSECUTOR:
      return 'Saksóknari'
    case UserRole.PROSECUTOR_REPRESENTATIVE:
      return 'Fulltrúi'
    case UserRole.DISTRICT_COURT_JUDGE:
    case UserRole.COURT_OF_APPEALS_JUDGE:
      return 'Dómari'
    case UserRole.DISTRICT_COURT_REGISTRAR:
    case UserRole.COURT_OF_APPEALS_REGISTRAR:
      return 'Dómritari'
    case UserRole.DISTRICT_COURT_ASSISTANT:
    case UserRole.COURT_OF_APPEALS_ASSISTANT:
      return 'Aðstoðarmaður dómara'
    case UserRole.PRISON_SYSTEM_STAFF:
      return 'Fangelsisyfirvöld'
    case UserRole.PUBLIC_PROSECUTOR_STAFF:
      return 'Skrifstofa'
    case UserRole.LOCAL_ADMIN:
      return 'Notendaumsjón'
    default:
      return 'Óþekkt'
  }
}
