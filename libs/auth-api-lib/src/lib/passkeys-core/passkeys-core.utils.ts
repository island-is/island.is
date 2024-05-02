import type { User } from '@island.is/auth-nest-tools'
import { BadRequestException } from '@nestjs/common'

export const getUserId = (user: User) => {
  if (!user.sub) {
    throw new BadRequestException('No user sub found')
  }

  return user.sub
}
