import { Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import graphqlTypeJson from 'graphql-type-json'

import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  User,
} from '@island.is/auth-nest-tools'
import { FinanceService } from '@island.is/clients/finance'

// @UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class FinanceResolver {
  constructor(private FinanceService: FinanceService) {}

  @Query(() => graphqlTypeJson)
  async getFinanceStatus(/*@CurrentUser() user: User */ nationalID: string) {
    // return this.FinanceService.getFinanceStatus(user.nationalId)
    return this.FinanceService.getFinanceStatus(nationalID)
  }

  @Query(() => graphqlTypeJson)
  async getFinanceStatusDetails(
    nationalID: string, // @CurrentUser() user: User,
    OrgID: string,
    chargeTypeID: string,
  ) {
    // return this.FinanceService.getFinanceStatusDetails(user.nationalId, OrgID, chargeTypeID)
    return this.FinanceService.getFinanceStatusDetails(
      nationalID,
      OrgID,
      chargeTypeID,
    )
  }
}
