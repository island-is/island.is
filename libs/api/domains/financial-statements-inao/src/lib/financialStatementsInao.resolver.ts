import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { ApiScope } from '@island.is/auth/scopes'
import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'

import { FinancialStatementsInaoService } from './financialStatementsInao.service'
import { Election } from './models/election.model'
import { ClientType } from './models/clientType.model'
import { InaoClientFinancialLimitInput } from './dto/clientFinancialLimit.input'
import { InaoCemeteryFinancialStatementInput } from './dto/cemeteryFinancialStatement.input'
import { InaoPoliticalPartyFinancialStatementInput } from './dto/politicalPartyFinancialStatement.input'
import { Config } from './models/config.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Resolver()
export class FinancialStatementsInaoResolver {
  constructor(
    private financialStatementsService: FinancialStatementsInaoService,
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

  @Query(() => [Election], { nullable: true })
  async financialStatementsInaoElections() {
    return this.financialStatementsService.getElections()
  }

  @Query(() => Number, { nullable: true })
  async financialStatementsInaoClientFinancialLimit(
    @Args('input') input: InaoClientFinancialLimitInput,
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

  @Mutation(() => Boolean)
  async financialStatementsInaoSubmitPoliticalPartyFinancialStatement(
    @CurrentUser() user: User,
    @Args('input') input: InaoPoliticalPartyFinancialStatementInput,
  ) {
    return this.financialStatementsService.submitPoliticalPartyFinancialStatement(
      user.nationalId,
      user.actor?.nationalId,
      input,
    )
  }

  @Mutation(() => Boolean)
  async financialStatementsInaoSubmitCemeteryFinancialStatement(
    @CurrentUser() user: User,
    @Args('input') input: InaoCemeteryFinancialStatementInput,
  ) {
    return this.financialStatementsService.submitCemeteryFinancialStatement(
      user.nationalId,
      user.actor?.nationalId,
      input,
    )
  }
}
