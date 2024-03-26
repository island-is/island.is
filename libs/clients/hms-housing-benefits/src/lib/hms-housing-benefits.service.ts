import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  ApiVversionPaymentPaymenthistoryPostRequest,
  PaymentApi,
} from '../../gen/fetch'
import { handle204 } from '@island.is/clients/middlewares'

@Injectable()
export class HmsHousingBenefitsClientService {
  constructor(private readonly paymentApi: PaymentApi) {}

  private apiWithAuth = (user: User) =>
    this.paymentApi.withMiddleware(new AuthMiddleware(user as Auth))

  async hmsPaymentHistory(
    user: User,
    input: ApiVversionPaymentPaymenthistoryPostRequest,
  ) {
    const res = await handle204(
      this.apiWithAuth(user).apiVversionPaymentPaymenthistoryPostRaw(input),
    )

    if (!res) return null
    return {
      ...res,
      totalCount: res.totalCount ?? 0,
      pageInfo: {
        ...res.pageInfo,
        hasNextPage: !!res.pageInfo?.hasNextPage,
      },
      data:
        res.data?.map((item) => ({
          ...item,
          nationalId: item.kennitala ?? undefined,
        })) ?? [],
    }
  }
}
