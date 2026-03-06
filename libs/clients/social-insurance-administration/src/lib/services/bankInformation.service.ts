import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  BankInformationApi,
  TrWebApiServicesCommonClientsModelsBankInformationInputModel,
} from '../../../gen/fetch/v1'
import { BankInformationWriteApi } from '../socialInsuranceAdministrationClient.type'
import {
  BankInformationDto,
  mapToBankInformationDto,
} from '../dto/bankInformation/bankInformation.dto'

@Injectable()
export class SocialInsuranceAdministrationBankInformationService {
  constructor(
    private readonly bankInformationApi: BankInformationApi,
    private readonly bankInformationWriteApi: BankInformationWriteApi,
  ) {}

  private bankInformationApiWithAuth = (user: User) =>
    this.bankInformationApi.withMiddleware(new AuthMiddleware(user as Auth))

  private bankInformationWriteApiWithAuth = (user: User) =>
    this.bankInformationWriteApi.withMiddleware(
      new AuthMiddleware(user as Auth),
    )

  async getBankInformation(user: User): Promise<BankInformationDto | null> {
    const bankInformation = await this.bankInformationApiWithAuth(user)
      .apiProtectedV1BankInformationBankInformationGet()
      .catch((error) => {
        if (error?.status === 404) {
          return null
        }
        if (error?.type === 'invalid-json') {
          return null
        }
        throw error
      })

    if (!bankInformation) {
      return null
    }

    return mapToBankInformationDto(bankInformation) ?? null
  }

  async postBankInformation(
    user: User,
    input: TrWebApiServicesCommonClientsModelsBankInformationInputModel,
  ): Promise<void> {
    await this.bankInformationWriteApiWithAuth(
      user,
    ).apiProtectedV1BankInformationBankInformationPost({
      trWebApiServicesCommonClientsModelsBankInformationInputModel: input,
    })
  }
}
