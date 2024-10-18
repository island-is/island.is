import jwt from 'jsonwebtoken'
import pick from 'lodash/pick'

import type { User } from '@island.is/auth-nest-tools'
import { BadRequestException } from '@nestjs/common'

export const getUserId = (user: User) => {
  if (!user.sub) {
    throw new BadRequestException('No user sub found')
  }

  return user.sub
}

interface TokenInfo {
  name: string
  idp: string
}

export const getTokenInfo = (token: string) => {
  const decodedToken = jwt.decode(token.replace('Bearer ', ''), {
    complete: true,
  })

  if (!decodedToken) {
    throw new BadRequestException('Invalid token')
  }

  return pick(decodedToken.payload, ['name', 'idp']) as TokenInfo
}
