import { registerEnumType } from '@nestjs/graphql'

export enum ApplicationType {
  Machine = 'machine',
  Native = 'native',
  Web = 'web',
}

registerEnumType(ApplicationType, {
  name: 'AuthAdminApplicationType',
})
