import { Query, Resolver, Args } from '@nestjs/graphql'
import { GetFinancialOverviewInput } from './dto/getOverview.input'
import { GetCustomerRecordsInput } from './dto/getCustomerRecords.input'
import { ExcelSheetInput } from './dto/getExcelSheet.input'
import { GetBillReceiptsInput } from './dto/getBillReceipts.input'
import { GetFinanceDocumentInput } from './dto/getFinanceDocument.input'
import { UseGuards } from '@nestjs/common'
import graphqlTypeJson from 'graphql-type-json'
import { CustomerChargeType } from './models/customerChargeType.model'
import { FinanceDocumentModel } from './models/financeDocument.model'
import { BillReceiptModel } from './models/billReceipts.model'
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

  @Query(() => BillReceiptModel)
  async getBillReceipts(
    @CurrentUser() user: User,
    @Args('input') input: GetBillReceiptsInput,
  ) {
    return this.FinanceService.getBillReceipts(
      user.nationalId,
      input.dayFrom,
      input.dayTo,
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

  @Query(() => graphqlTypeJson)
  async getExcelDocument(@Args('input') input: ExcelSheetInput) {
    return this.FinanceService.getExcelDocument(input.headers, input.data)
  }
}
