import { Query, Resolver, Args } from '@nestjs/graphql'
import { GetFinancialOverviewInput } from './dto/getOverview.input'
import { GetCustomerRecordsInput } from './dto/getCustomerRecords.input'
import { GetDocumentsListInput } from './dto/getDocumentsList.input'
import { GetFinanceDocumentInput } from './dto/getFinanceDocument.input'
import { GetAnnualStatusDocumentInput } from './dto/getAnnualStatusDocument.input'
import { UseGuards } from '@nestjs/common'
import graphqlTypeJson from 'graphql-type-json'
import { CustomerChargeType } from './models/customerChargeType.model'
import { FinanceDocumentModel } from './models/financeDocument.model'
import { CustomerTapsControlModel } from './models/customerTapsControl.model'
import { DocumentsListModel } from './models/documentsList.model'
import { CustomerRecords } from './models/customerRecords.model'

import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
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

  @Query(() => DocumentsListModel)
  async getDocumentsList(
    @CurrentUser() user: User,
    @Args('input') input: GetDocumentsListInput,
  ) {
    return this.FinanceService.getDocumentsList(
      user.nationalId,
      input.dayFrom,
      input.dayTo,
      input.listPath,
    )
  }

  @Query(() => FinanceDocumentModel, { nullable: true })
  async getFinanceDocument(
    @CurrentUser() user: User,
    @Args('input') input: GetFinanceDocumentInput,
  ) {
    return this.FinanceService.getFinanceDocument(
      user.nationalId,
      input.documentID,
    )
  }

  @Query(() => FinanceDocumentModel, { nullable: true })
  async getAnnualStatusDocument(
    @CurrentUser() user: User,
    @Args('input') input: GetAnnualStatusDocumentInput,
  ) {
    return this.FinanceService.getAnnualStatusDocument(
      user.nationalId,
      input.year,
    )
  }

  @Query(() => CustomerTapsControlModel, { nullable: true })
  async getCustomerTapControl(@CurrentUser() user: User) {
    return this.FinanceService.getCustomerTapControl(user.nationalId)
  }
}
