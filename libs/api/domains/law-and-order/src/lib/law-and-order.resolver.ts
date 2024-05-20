import { Args, Query, Resolver } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { DownloadServiceConfig } from '@island.is/nest/config'
import type { ConfigType } from '@island.is/nest/config'
import { LawAndOrderService } from './law-and-order.service'
import { GetCourtCaseInput } from '../dto/getCourtCaseInput'
import { CourtCases } from '../models/courtCases.model'
import { CourtCase } from '../models/courtCase.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/law-and-order' })
export class LawAndOrderResolver {
  constructor(
    private readonly lawAndOrderService: LawAndOrderService,
    @Inject(DownloadServiceConfig.KEY)
    private readonly downloadServiceConfig: ConfigType<
      typeof DownloadServiceConfig
    >,
  ) {}

  //@Scopes(ApiScope.lawAndOrder)
  @Query(() => CourtCases, { name: 'courtCasesList', nullable: true })
  @Audit()
  async getCourtCasesList(@CurrentUser() user: User) {
    return this.lawAndOrderService.getCourtCases(user)
  }

  //@Scopes(ApiScope.lawAndOrder)
  @Query(() => CourtCase, { name: 'courtCaseDetail', nullable: true })
  @Audit()
  async getCourtCaseDetail(
    @CurrentUser() user: User,
    @Args('input') input: GetCourtCaseInput,
  ) {
    const data = this.lawAndOrderService.getCourtCase(user, input.id)
    return data
  }
}
