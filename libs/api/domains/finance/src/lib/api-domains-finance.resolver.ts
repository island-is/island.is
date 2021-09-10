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
import { Audit } from '@island.is/nest/audit'
import { FinanceService } from '@island.is/clients/finance'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/finance' })
export class FinanceResolver {
  constructor(private FinanceService: FinanceService) {}

  @Query(() => graphqlTypeJson)
  @Audit()
  async getFinanceStatus(@CurrentUser() user: User) {
    return this.FinanceService.getFinanceStatus(
      user.nationalId,
      user.authorization,
    )
  }

  @Query(() => graphqlTypeJson)
  @Audit()
  async getFinanceStatusDetails(
    @CurrentUser() user: User,
    @Args('input') input: GetFinancialOverviewInput,
  ) {
    return this.FinanceService.getFinanceStatusDetails(
      user.nationalId,
      input.OrgID,
      input.chargeTypeID,
      user.authorization,
    )
  }

  @Query(() => CustomerChargeType, { nullable: true })
  @Audit()
  async getCustomerChargeType(@CurrentUser() user: User) {
    return this.FinanceService.getCustomerChargeType(
      user.nationalId,
      user.authorization,
    )
  }

  @Query(() => CustomerRecords, { nullable: true })
  @Audit()
  async getCustomerRecords(
    @CurrentUser() user: User,
    @Args('input') input: GetCustomerRecordsInput,
  ) {
    return this.FinanceService.getCustomerRecords(
      user.nationalId,
      input.chargeTypeID,
      input.dayFrom,
      input.dayTo,
      user.authorization,
    )
  }

  @Query(() => DocumentsListModel)
  @Audit()
  async getDocumentsList(
    @CurrentUser() user: User,
    @Args('input') input: GetDocumentsListInput,
  ) {
    return this.FinanceService.getDocumentsList(
      user.nationalId,
      input.dayFrom,
      input.dayTo,
      input.listPath,
      user.authorization,
    )
  }

  @Query(() => FinanceDocumentModel, { nullable: true })
  @Audit()
  async getFinanceDocument(
    @CurrentUser() user: User,
    @Args('input') input: GetFinanceDocumentInput,
  ) {
    return this.FinanceService.getFinanceDocument(
      user.nationalId,
      input.documentID,
      user.authorization,
    )
  }

  @Query(() => FinanceDocumentModel, { nullable: true })
  @Audit()
  async getAnnualStatusDocument(
    @CurrentUser() user: User,
    @Args('input') input: GetAnnualStatusDocumentInput,
  ) {
    return this.FinanceService.getAnnualStatusDocument(
      user.nationalId,
      input.year,
      user.authorization,
    )
  }

  @Query(() => CustomerTapsControlModel, { nullable: true })
  @Audit()
  async getCustomerTapControl(@CurrentUser() user: User) {
    return this.FinanceService.getCustomerTapControl(
      user.nationalId,
      user.authorization,
    )
  }
}
