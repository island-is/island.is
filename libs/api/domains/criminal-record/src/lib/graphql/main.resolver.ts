import { Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
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
