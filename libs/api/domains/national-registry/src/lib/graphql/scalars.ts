import { registerEnumType } from '@nestjs/graphql'
import { FamilyRelation } from './familyRelation.enum'
import { Gender } from './gender.enum'
import { Gender, MaritalStatus } from '../types'

registerEnumType(MaritalStatus, {
  name: 'MaritalStatus',
})

registerEnumType(Gender, {
  name: 'Gender',
})

registerEnumType(FamilyRelation, {
  name: 'FamilyRelation',
})
