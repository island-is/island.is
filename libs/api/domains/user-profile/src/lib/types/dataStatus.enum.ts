import { registerEnumType } from '@nestjs/graphql'

export enum DataStatus {
  NOT_DEFINED = 'NOT_DEFINED',
  NOT_VERIFIED = 'NOT_VERIFIED',
  VERIFIED = 'VERIFIED',
  EMPTY = 'EMPTY',
}

registerEnumType(DataStatus, {
  name: 'DataStatus',
})
