import { SetMetadata } from '@nestjs/common'
import { AccessGroup } from './access.enum'

export const ACCESS_GROUP_KEY = 'accessGroup'
export const HasAccessGroup = (...accessGroup: AccessGroup[]) =>
  SetMetadata(ACCESS_GROUP_KEY, accessGroup)
