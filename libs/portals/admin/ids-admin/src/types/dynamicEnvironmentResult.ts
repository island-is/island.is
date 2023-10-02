import { AuthAdminEnvironment } from '@island.is/api/schema'

export type DynamicEnvironmentResult<T> = {
  [K in keyof T]: T[K]
} & {
  environment: AuthAdminEnvironment
}
