import { User } from '@island.is/auth-nest-tools'
import { FinanceClientService } from '@island.is/clients/finance'
import { FinanceClientV3Service } from '@island.is/clients/finance-v3'
import { Injectable } from '@nestjs/common'
import { GetCustomerRecordsInput } from '../dto/getCustomerRecords.input'
import { GetCustomerRecordsPagedInput } from '../dto/getCustomerRecordsPaged.input'
import { CustomerRecordsPagedCollection } from '../models/customerRecordsPagedCollection.model'

@Injectable()
export class CustomerService {
  constructor(
    private readonly financeService: FinanceClientService,
    private readonly financeV3Service: FinanceClientV3Service,
  ) {}

  async getChargeType(user: User) {
    return this.financeService.getCustomerChargeType(user.nationalId, user)
  }

  async getTapControl(user: User) {
    return this.financeService.getCustomerTapControl(user.nationalId, user)
  }

  async getRecords(user: User, input: GetCustomerRecordsInput) {
    return this.financeService.getCustomerRecords(
      user.nationalId,
      input.chargeTypeID,
      input.dayFrom,
      input.dayTo,
      user,
    )
  }

  async getRecordsPaged(
    user: User,
    input: GetCustomerRecordsPagedInput,
  ): Promise<CustomerRecordsPagedCollection | null> {
    const response = await this.financeV3Service.getCustomerRecords(user, {
      nationalID: user.nationalId,
      chargeTypeID: input.chargeTypeID,
      dayFrom: input.dayFrom,
      dayTo: input.dayTo,
      nextKey: input.nextKey,
    })

    if (!response) return null

    const records = (response.records ?? []).map((r) => ({
      ...r,
      amount: Number(r.amount),
    }))

    return {
      data: records,
      totalCount: records.length,
      pageInfo: {
        hasNextPage: response.more,
        startCursor: response.nextKey || undefined,
      },
    }
  }
}
