import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  User,
} from '@island.is/auth-nest-tools'
import { CriminalRecordService } from '../criminalRecord.service'
import { CriminalRecord } from './models'

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
