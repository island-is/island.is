import { registerEnumType } from '@nestjs/graphql'

export enum Environment {
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
}

registerEnumType(Environment, {
  name: 'AuthAdminEnvironment',
})
