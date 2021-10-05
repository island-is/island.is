import * as randomString from 'randomstring'

import { User } from '@island.is/auth-nest-tools'

interface CreateCurrentUser {
  nationalId: string
  scope: string[]
  authorization: string
  client: string
}

const defaultValues: User = {
  nationalId: randomString.generate({ length: 10, charset: 'numeric' }),
  scope: [],
  authorization: '',
  client: '',
}

export const createCurrentUser = ({
  nationalId = defaultValues.nationalId,
  scope = defaultValues.scope,
  authorization = defaultValues.authorization,
  client = defaultValues.client,
}: CreateCurrentUser = defaultValues): User => ({
  nationalId,
  scope,
  authorization,
  client,
})
