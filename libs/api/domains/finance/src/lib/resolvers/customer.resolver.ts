import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
  type User,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { GetCustomerRecordsInput } from '../dto/getCustomerRecords.input'
import { GetCustomerRecordsPagedInput } from '../dto/getCustomerRecordsPaged.input'
import { CustomerChargeType } from '../models/customerChargeType.model'
import { CustomerRecords } from '../models/customerRecords.model'
import { CustomerRecordsPagedCollection } from '../models/customerRecordsPagedCollection.model'
import { CustomerTapsControlModel } from '../models/customerTapsControl.model'
import { CustomerService } from '../services/customer.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.financeOverview)
@Resolver()
@Audit({ namespace: '@island.is/api/finance' })
export class FinanceCustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  @Query(() => CustomerRecords, { nullable: true })
  @Audit()
  async getCustomerRecords(
    @CurrentUser() user: User,
    @Args('input') input: GetCustomerRecordsInput,
  ) {
    return this.customerService.getRecords(user, input)
  }

  @Query(() => CustomerRecordsPagedCollection, { nullable: true })
  @Audit()
  async getCustomerRecordsPaged(
    @CurrentUser() user: User,
    @Args('input') input: GetCustomerRecordsPagedInput,
  ) {
    return this.customerService.getRecordsPaged(user, input)
  }

  @Query(() => CustomerChargeType, { nullable: true })
  @Audit()
  async getCustomerChargeType(@CurrentUser() user: User) {
    return this.customerService.getChargeType(user)
  }

  @Query(() => CustomerTapsControlModel, { nullable: true })
  @Audit()
  @Scopes(ApiScope.financeOverview, ApiScope.financeSalary)
  async getCustomerTapControl(@CurrentUser() user: User) {
    return this.customerService.getTapControl(user)
  }
}
