import { registerEnumType } from '@nestjs/graphql'
import { Gender, MaritalStatus } from '.'

registerEnumType(MaritalStatus, {
  name: 'MaritalStatus',
})

registerEnumType(Gender, {
  name: 'Gender',
})
