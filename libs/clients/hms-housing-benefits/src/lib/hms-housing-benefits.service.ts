import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  ApiVversionPaymentPaymenthistoryPostRequest,
  PaymentApi,
} from '../../gen/fetch'

@Injectable()
export class HmsHousingBenefitsClientService {
  constructor(private readonly paymentApi: PaymentApi) {}

  private apiWithAuth = (user: User) =>
    this.paymentApi.withMiddleware(new AuthMiddleware(user as Auth))

  async hmsPaymentHistory(
    user: User,
    input: ApiVversionPaymentPaymenthistoryPostRequest,
  ) {
    const res = await this.apiWithAuth(
      user,
    ).apiVversionPaymentPaymenthistoryPost(input)
    return {
      ...res,
      totalCount: res.totalCount ?? 0,
      pageInfo: {
        ...res.pageInfo,
        hasNextPage: !!res.pageInfo?.hasNextPage,
        startCursor: res.pageInfo?.startCursor ?? undefined,
        endCursor: res.pageInfo?.endCursor ?? undefined,
      },
      data:
        res.data?.map((item) => ({
          ...item,
          nationalId: item.kennitala ?? undefined,
        })) ?? [],
    }
  }
}
