import { AuthAdminEnvironment } from '@island.is/api/schema'

export type PublishData = {
  toEnvironment: AuthAdminEnvironment | null
  fromEnvironment: AuthAdminEnvironment | null
}
