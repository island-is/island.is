import { registerEnumType } from '@nestjs/graphql'

export enum Environment {
  Dev = 'development',
  Staging = 'staging',
  Production = 'production',
}

registerEnumType(Environment, {
  name: 'AuthAdminEnvironment',
})
