import { registerEnumType } from '@nestjs/graphql'

export enum Environment {
  Dev = 'dev',
  Staging = 'staging',
  Production = 'production',
}

registerEnumType(Environment, {
  name: 'AuthAdminEnvironment',
})
