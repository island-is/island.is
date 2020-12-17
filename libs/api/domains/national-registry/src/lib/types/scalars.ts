import { registerEnumType } from '@nestjs/graphql'
import { FamilyRelation } from './familyRelation.enum'
import { Gender } from './gender.enum'
import { MaritalStatus } from './maritalStatus.enum'

registerEnumType(MaritalStatus, {
  name: 'MaritalStatus',
})

registerEnumType(Gender, {
  name: 'Gender',
})

registerEnumType(FamilyRelation, {
  name: 'FamilyRelation',
})
