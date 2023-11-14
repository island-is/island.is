import { Query, Resolver, Args } from '@nestjs/graphql'
import { ForbiddenException, Inject, UseGuards } from '@nestjs/common'
import graphqlTypeJson from 'graphql-type-json'

import { ApiScope } from '@island.is/auth/scopes'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  Scopes,
} from '@island.is/auth-nest-tools'
import { FinanceClientService } from '@island.is/clients/finance'
import { FinanceClientV2Service } from '@island.is/clients/finance-v2'
import { Audit, AuditService } from '@island.is/nest/audit'
import { DownloadServiceConfig } from '@island.is/nest/config'
import type { ConfigType } from '@island.is/nest/config'

import { GetFinancialOverviewInput } from './dto/getOverview.input'
import { GetCustomerRecordsInput } from './dto/getCustomerRecords.input'
import { GetFinanceDocumentsListInput } from './dto/getFinanceDocumentsList.input'
import { GetFinanceDocumentInput } from './dto/getFinanceDocument.input'
import { GetAnnualStatusDocumentInput } from './dto/getAnnualStatusDocument.input'
import { CustomerChargeType } from './models/customerChargeType.model'
import { FinanceDocumentModel } from './models/financeDocument.model'
import { CustomerTapsControlModel } from './models/customerTapsControl.model'
import { DocumentsListModel } from './models/documentsList.model'
import { CustomerRecords } from './models/customerRecords.model'
import {
  PaymentScheduleDetailModel,
  PaymentScheduleModel,
} from './models/paymentSchedule.model'
import { DebtStatusModel } from './models/debtStatus.model'
import { GetFinancePaymentScheduleInput } from './dto/getFinancePaymentSchedule.input'
import { AssessmentYears } from './models/assessmentYears.model'
import { ChargeTypesByYear } from './models/chargeTypesByYear.model'
import { FinanceChargeTypeDetails } from './models/chargeTypeDetails.model'
import { ChargeTypePeriodSubject } from './models/chargeTypePeriodSubject.model'
import { ChargeItemSubjectsByYear } from './models/chargeItemSubjectsByYear.model'
import { GetChargeTypesByYearInput } from './dto/getChargeTypesByYear.input'
import { GetChargeTypesDetailsByYearInput } from './dto/getChargeTypesDetailsByYear.input'
import { GetChargeItemSubjectsByYearInput } from './dto/getChargeItemSubjectsByYear.input'
import { GetChargeTypePeriodSubjectInput } from './dto/getChargeTypePeriodSubject.input'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.financeOverview)
@Resolver()
@Audit({ namespace: '@island.is/api/finance' })
export class FinanceResolver {
  constructor(
    private financeService: FinanceClientService,
    private financeServiceV2: FinanceClientV2Service,
    @Inject(DownloadServiceConfig.KEY)
    private readonly downloadServiceConfig: ConfigType<
      typeof DownloadServiceConfig
    >,
    private readonly auditService: AuditService,
  ) {}

  @Query(() => graphqlTypeJson)
  @Audit()
  async getFinanceStatus(@CurrentUser() user: User) {
    const financeStatus = await this.financeService.getFinanceStatus(
      user.nationalId,
      user,
    )
    return {
      ...financeStatus,
      downloadServiceURL: `${this.downloadServiceConfig.baseUrl}/download/v1/finance/`,
    }
  }

  @Query(() => graphqlTypeJson, { nullable: true })
  @Audit()
  async getFinanceStatusDetails(
    @CurrentUser() user: User,
    @Args('input') input: GetFinancialOverviewInput,
  ) {
    return this.financeService.getFinanceStatusDetails(
      user.nationalId,
      input.orgID,
      input.chargeTypeID,
      user,
    )
  }

  @Query(() => CustomerChargeType, { nullable: true })
  @Audit()
  async getCustomerChargeType(@CurrentUser() user: User) {
    return this.financeService.getCustomerChargeType(user.nationalId, user)
  }

  @Query(() => CustomerRecords, { nullable: true })
  @Audit()
  async getCustomerRecords(
    @CurrentUser() user: User,
    @Args('input') input: GetCustomerRecordsInput,
  ) {
    return this.financeService.getCustomerRecords(
      user.nationalId,
      input.chargeTypeID,
      input.dayFrom,
      input.dayTo,
      user,
    )
  }

  @Query(() => DocumentsListModel)
  @Scopes(ApiScope.financeOverview, ApiScope.financeSalary)
  async getDocumentsList(
    @CurrentUser() user: User,
    @Args('input') input: GetFinanceDocumentsListInput,
  ) {
    if (
      input.listPath === 'employeeClaims' &&
      !user.scope.includes(ApiScope.financeSalary)
    ) {
      throw new ForbiddenException()
    }

    const documentsList = await this.financeService.getDocumentsList(
      user.nationalId,
      input.dayFrom,
      input.dayTo,
      input.listPath,
      user,
    )

    this.auditService.audit({
      auth: user,
      namespace: '@island.is/api/finance',
      action: 'getDocumentList',
      meta: {
        path: input.listPath,
        dateFrom: input.dayFrom,
        dateTo: input.dayTo,
      },
    })

    return {
      ...documentsList,
      downloadServiceURL: `${this.downloadServiceConfig.baseUrl}/download/v1/finance/`,
    }
  }

  @Query(() => FinanceDocumentModel, { nullable: true })
  async getFinanceDocument(
    @CurrentUser() user: User,
    @Args('input') input: GetFinanceDocumentInput,
  ) {
    return this.auditService.auditPromise(
      {
        auth: user,
        namespace: '@island.is/api/finance',
        action: 'getFinanceDocument',
        resources: input.documentID,
      },
      this.financeService.getFinanceDocument(
        user.nationalId,
        input.documentID,
        user,
      ),
    )
  }

  @Query(() => FinanceDocumentModel, { nullable: true })
  @Audit()
  async getAnnualStatusDocument(
    @CurrentUser() user: User,
    @Args('input') input: GetAnnualStatusDocumentInput,
  ) {
    return this.financeService.getAnnualStatusDocument(
      user.nationalId,
      input.year,
      user,
    )
  }

  @Query(() => CustomerTapsControlModel, { nullable: true })
  @Audit()
  @Scopes(ApiScope.financeOverview, ApiScope.financeSalary)
  async getCustomerTapControl(@CurrentUser() user: User) {
    return this.financeService.getCustomerTapControl(user.nationalId, user)
  }

  @Query(() => PaymentScheduleModel, { nullable: true })
  @Audit()
  @Scopes(ApiScope.financeOverview, ApiScope.financeSchedule)
  async getPaymentSchedule(@CurrentUser() user: User) {
    const res = await this.financeService.getPaymentSchedules(
      user.nationalId,
      user,
    )
    if (res?.myPaymentSchedule.paymentSchedules) {
      const data = res?.myPaymentSchedule.paymentSchedules.map((item) => {
        return {
          ...item,
          downloadServiceURL: `${this.downloadServiceConfig.baseUrl}/download/v1/finance/${item.documentID}`,
        }
      })

      return {
        myPaymentSchedule: {
          nationalId: res?.myPaymentSchedule.nationalId,
          paymentSchedules: data,
        },
      }
    }
    return null
  }

  @Query(() => DebtStatusModel)
  @Audit()
  @Scopes(ApiScope.financeOverview, ApiScope.financeSchedule)
  async getDebtStatus(@CurrentUser() user: User) {
    return this.financeService.getDebtStatus(user.nationalId, user)
  }

  @Query(() => PaymentScheduleDetailModel)
  @Audit()
  @Scopes(ApiScope.financeOverview, ApiScope.financeSchedule)
  async getPaymentScheduleById(
    @CurrentUser() user: User,
    @Args('input') input: GetFinancePaymentScheduleInput,
  ) {
    return this.financeService.getPaymentScheduleById(
      user.nationalId,
      input.scheduleNumber,
      user,
    )
  }

  @Query(() => AssessmentYears)
  @Audit()
  async getAssessmentYears(@CurrentUser() user: User) {
    return await this.financeServiceV2.getAssessmentYears(user)
  }

  @Query(() => ChargeTypesByYear, { nullable: true })
  @Audit()
  async getChargeTypesByYear(
    @CurrentUser() user: User,
    @Args('input') input: GetChargeTypesByYearInput,
  ) {
    return await this.financeServiceV2.getChargeTypesByYear(user, input.year)
  }

  @Query(() => FinanceChargeTypeDetails)
  @Audit()
  async getChargeTypesDetailsByYear(
    @CurrentUser() user: User,
    @Args('input') input: GetChargeTypesDetailsByYearInput,
  ) {
    return await this.financeServiceV2.getChargeTypesDetailsByYear(
      user,
      input.year,
      input.typeId,
    )
  }

  @Query(() => ChargeItemSubjectsByYear)
  @Audit()
  async getChargeItemSubjectsByYear(
    @CurrentUser() user: User,
    @Args('input') input: GetChargeItemSubjectsByYearInput,
  ) {
    return await this.financeServiceV2.getChargeItemSubjectsByYear(
      user,
      input.year,
      input.typeId,
      input.nextKey,
    )
  }

  @Query(() => ChargeTypePeriodSubject)
  @Audit()
  async getChargeTypePeriodSubject(
    @CurrentUser() user: User,
    @Args('input') input: GetChargeTypePeriodSubjectInput,
  ) {
    return await this.financeServiceV2.getChargeTypePeriodSubject(
      user,
      input.year,
      input.typeId,
      input.subject,
      input.period,
    )
  }
}
