import { Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  User,
} from '@island.is/auth-nest-tools'
import { RSKService } from '@island.is/clients/rsk/v1'
import { CurrentUserCompanies } from './models/currentUserCompanies.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class RSKResolver {
  constructor(private RSKService: RSKService) {}

  @Query(() => [CurrentUserCompanies])
  async rskCurrentUserCompanies(@CurrentUser() user: User) {
    return this.RSKService.getCompaniesByNationalId(user.nationalId)
  }
}
