import { AuthAdminEnvironment } from '@island.is/api/schema'

export interface UserIdentityClaim {
  type: string
  value: string
}

export interface UserIdentityRow {
  subjectId: string
  name: string
  providerName: string
  providerSubjectId: string
  availableEnvironments: AuthAdminEnvironment[]
  activeEnvironments: AuthAdminEnvironment[]
  deactivatedEnvironments: AuthAdminEnvironment[]
  claims: UserIdentityClaim[]
}
