import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { handle404 } from '@island.is/clients/middlewares'
import {
  BankInformationApi,
  TrWebApiServicesCommonClientsModelsBankInformationInputModel,
} from '../../../gen/fetch/v1'
import {
  BankInformationDto,
  mapToBankInformationDto,
} from '../dto/bankInformation/bankInformation.dto'

@Injectable()
export class SocialInsuranceAdministrationBankInformationService {
  constructor(private readonly bankInformationApi: BankInformationApi) {}

  private bankInformationApiWithAuth = (user: User) =>
    this.bankInformationApi.withMiddleware(new AuthMiddleware(user as Auth))

  async getBankInformation(user: User): Promise<BankInformationDto | null> {
    const bankInformation = await this.bankInformationApiWithAuth(user)
      .apiProtectedV1BankInformationBankInformationGet()
      .catch(handle404)

    if (!bankInformation) {
      return null
    }

    return mapToBankInformationDto(bankInformation) ?? null
  }

  async postBankInformation(
    user: User,
    input: TrWebApiServicesCommonClientsModelsBankInformationInputModel,
  ): Promise<void> {
    await this.bankInformationApiWithAuth(
      user,
    ).apiProtectedV1BankInformationBankInformationPost({
      trWebApiServicesCommonClientsModelsBankInformationInputModel: input,
    })
  }
}
