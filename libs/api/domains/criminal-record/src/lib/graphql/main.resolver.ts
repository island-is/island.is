import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'

import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'

import { CriminalRecordService } from '../criminalRecord.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class MainResolver {
  constructor(private readonly criminalRecordService: CriminalRecordService) {}

  @Query(() => Boolean)
  async criminalRecordValidation(@CurrentUser() user: User) {
    return await this.criminalRecordService.validateCriminalRecord(
      user.nationalId,
    )
  }
}
