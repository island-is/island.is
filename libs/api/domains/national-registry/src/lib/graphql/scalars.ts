import { registerEnumType } from '@nestjs/graphql'
import { Gender, MaritalStatus, FamilyRelation } from '../types'

registerEnumType(MaritalStatus, {
  name: 'MaritalStatus',
})

registerEnumType(Gender, {
  name: 'Gender',
})

registerEnumType(FamilyRelation, {
  name: 'FamilyRelation',
})
