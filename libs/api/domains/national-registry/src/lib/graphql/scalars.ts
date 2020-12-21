import { registerEnumType } from '@nestjs/graphql'

import { Gender, MaritalStatus } from '../types'

registerEnumType(MaritalStatus, {
  name: 'MaritalStatus',
})

registerEnumType(Gender, {
  name: 'Gender',
})
