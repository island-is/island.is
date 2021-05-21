import { Query, Resolver, Args } from '@nestjs/graphql'
import { GetFinancialOverviewInput } from './dto/getOverview.input'
import { GetCustomerRecordsInput } from './dto/getCustomerRecords.input'
import { UseGuards } from '@nestjs/common'
import graphqlTypeJson from 'graphql-type-json'
import { CustomerChargeType } from './models/customerChargeType.model'
import { CustomerRecords } from './models/customerRecords.model'

import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  User,
} from '@island.is/auth-nest-tools'
import { FinanceService } from '@island.is/clients/finance'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class FinanceResolver {
  constructor(private FinanceService: FinanceService) {}

  @Query(() => graphqlTypeJson)
  async getFinanceStatus(@CurrentUser() user: User) {
    return this.FinanceService.getFinanceStatus(user.nationalId)
  }

  @Query(() => graphqlTypeJson)
  async getFinanceStatusDetails(
    @CurrentUser() user: User,
    @Args('input') input: GetFinancialOverviewInput,
  ) {
    return this.FinanceService.getFinanceStatusDetails(
      user.nationalId,
      input.OrgID,
      input.chargeTypeID,
    )
  }

  @Query(() => CustomerChargeType, { nullable: true })
  async getCustomerChargeType(@CurrentUser() user: User) {
    return this.FinanceService.getCustomerChargeType(user.nationalId)
  }

  @Query(() => CustomerRecords, { nullable: true })
  async getCustomerRecords(
    @CurrentUser() user: User,
    @Args('input') input: GetCustomerRecordsInput,
  ) {
    return this.FinanceService.getCustomerRecords(
      user.nationalId,
      input.chargeTypeID,
      input.dayFrom,
      input.dayTo,
    )
  }
}
