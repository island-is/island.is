import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { ApiScope } from '@island.is/auth/scopes'
import { FinancialStatementCemeteryService } from './financialStatementCemetery.service'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { ClientType } from './models/clientType.model'
import { Config } from './models/config.model'
import { TaxInfo } from './models/taxInfo.model'
import { CemeteryClientFinancialLimitInput } from './dto/clientFinancialLimit.input'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal, ApiScope.internalProcuring)
@Resolver()
export class FinancialStatementCemeteryResolver {
  constructor(
    private financialStatementsService: FinancialStatementCemeteryService,
  ) {}

  @Query(() => [ClientType], { nullable: true })
  async financialStatementsInaoClientTypes() {
    return this.financialStatementsService.getClientTypes()
  }

  @Query(() => ClientType, { nullable: true })
  async financialStatementsInaoCurrentUserClientType(
    @CurrentUser() user: User,
  ): Promise<ClientType | null> {
    return this.financialStatementsService.getUserClientType(user.nationalId)
  }

  @Query(() => Number, { nullable: true })
  async financialStatementsInaoClientFinancialLimit(
    @Args('input') input: CemeteryClientFinancialLimitInput,
  ) {
    return this.financialStatementsService.getClientFinancialLimit(
      input.clientType,
      input.year,
    )
  }

  @Query(() => [Config])
  async financialStatementsInaoConfig() {
    return this.financialStatementsService.getConfig()
  }

  @Query(() => [TaxInfo])
  async financialStatementsInaoTaxInfo(
    @CurrentUser() user: User,
    @Args('year') year: string,
  ) {
    return this.financialStatementsService.getTaxInformation(
      user.nationalId,
      year,
    )
  }
}
