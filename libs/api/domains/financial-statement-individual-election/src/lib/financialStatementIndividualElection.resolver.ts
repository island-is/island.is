import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { Args, Resolver, Query } from '@nestjs/graphql'
import { ApiScope } from '@island.is/auth/scopes'
import { ClientType } from './model/clientType.model'
import { Election } from './model/election.model'
import { InaoClientFinancialLimitInput } from './dto/clientFinancialLimitInput'
import { Config } from './model/config.model'
import { TaxInfo } from './model/taxInfo.model'
import { FinancialStatementIndividualElectionService } from './financialStatementIndividualElection.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal, ApiScope.internalProcuring)
@Resolver()
export class FinancialStatementIndividualElectionResolver {
  constructor(
    private financialStatementService: FinancialStatementIndividualElectionService,
  ) {}

  @Query(() => [ClientType], { nullable: true })
  async financialStatementIndividualElectionClientTypes() {
    return this.financialStatementService.getClientTypes()
  }

  @Query(() => ClientType, { nullable: true })
  async financialStatementIndividualElectionCurrentUserClientType(
    @CurrentUser() user: User,
  ): Promise<ClientType | null> {
    return this.financialStatementService.getUserClientType(user.nationalId)
  }

  @Query(() => [Election], { nullable: true })
  async financialStatementIndividualElectionElections(
    @CurrentUser() user: User,
  ) {
    return this.financialStatementService.getElections(user.nationalId)
  }

  @Query(() => Number, { nullable: true })
  async financialStatementIndividualElectionClientFinancialLimit(
    @Args('input') input: InaoClientFinancialLimitInput,
  ) {
    return this.financialStatementService.getClientFinancialLimit(
      input.clientType,
      input.year,
    )
  }

  @Query(() => [Config])
  async financialStatementIndividualElectionConfig() {
    return this.financialStatementService.getConfig()
  }

  @Query(() => [TaxInfo])
  async financialStatementIndividualElectionTaxInfo(
    @CurrentUser() user: User,
    @Args('year') year: string,
  ) {
    return this.financialStatementService.getTaxInformation(
      user.nationalId,
      year,
    )
  }
}
