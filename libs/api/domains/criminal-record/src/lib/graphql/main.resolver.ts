import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { IdsUserGuard, ScopesGuard } from '@island.is/auth-nest-tools'
import { CriminalRecordService } from '../criminalRecord.service'
import { CriminalRecord } from './models'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class MainResolver {
  constructor(private readonly criminalRecordService: CriminalRecordService) {}

  //Note: not being used
  @Query(() => CriminalRecord)
  async getCriminalRecord(@Args('ssn') ssn: string) {
    return await this.criminalRecordService.getCriminalRecord(ssn)
  }

  @Query(() => Boolean)
  async checkCriminalRecord(@Args('ssn') ssn: string) {
    return await this.criminalRecordService.checkCriminalRecord(ssn)
  }
}
