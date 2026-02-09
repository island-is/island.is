import { Inject, Injectable } from '@nestjs/common'
import { HomeApi } from '../gen/fetch'
import { Configuration, ConfidentialClientApplication } from '@azure/msal-node'

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { isDefined } from '@island.is/shared/utils'
import {
  mapRentalAgreementDto,
  RentalAgreementDto,
} from './dtos/rentalAgreements.dto'
import { INACTIVE_AGREEMENT_STATUSES } from './constants'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import {
  ContractDocumentItemDto,
  mapContractDocumentItemDto,
} from './dtos/contractDocument.dto'
import { HmsRentalAgreementClientConfig } from './hmsRentalAgreement.config'
import { type ConfigType } from '@nestjs/config'
import { CustomMiddleware } from './customMiddleware'

@Injectable()
export class HmsRentalAgreementService {
  constructor(
    @Inject(HmsRentalAgreementClientConfig.KEY)
    private config: ConfigType<typeof HmsRentalAgreementClientConfig>,
    private readonly api: HomeApi,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private async getADAccessToken() {
    const msalConfig: Configuration = {
      auth: {
        clientId: this.config.authClientId,
        clientSecret: this.config.authClientSecret,
        authority: `https://login.microsoftonline.com/${this.config.authTenantId}`,
      },
    }

    const clientApplication = new ConfidentialClientApplication(msalConfig)

    const tokenResponse =
      await clientApplication.acquireTokenByClientCredential({
        scopes: [`api://${this.config.authClientId}/.default`],
      })
    return tokenResponse?.accessToken as string
  }

  private apiWithAuth = async (user: User) => {
    const entraToken = await this.getADAccessToken()

    return this.api
      .withMiddleware(
        new AuthMiddleware(user as Auth, {
          forwardUserInfo: true,
          customHeaderForToken: 'X-User-Authorization',
        }),
      )
      .withMiddleware(new CustomMiddleware(entraToken))
  }

  async getRentalAgreements(
    user: User,
    hideInactiveAgreements = false,
  ): Promise<RentalAgreementDto[]> {
    const res = await (
      await this.apiWithAuth(user)
    ).contractKtKtGet({
      kt: user.nationalId,
    })

    const data = res.map(mapRentalAgreementDto).filter(isDefined)
    if (hideInactiveAgreements) {
      return data.filter((d) => !INACTIVE_AGREEMENT_STATUSES.includes(d.status))
    }
    return data
  }

  async getRentalAgreement(
    user: User,
    id: string,
  ): Promise<RentalAgreementDto | undefined> {
    const data = await (
      await this.apiWithAuth(user)
    ).contractContractIdGet({
      contractId: id,
    })

    if (!data.contractId) {
      this.logger.warn('Malformed contract, returning null', {
        id,
      })
      return
    }

    return mapRentalAgreementDto(data) ?? undefined
  }

  async getRentalAgreementPdf(
    user: User,
    contractId: number,
    documentId: number,
  ): Promise<ContractDocumentItemDto | undefined> {
    const res = await (
      await this.apiWithAuth(user)
    ).contractContractIdDocumentDocumentIdGet({
      contractId,
      documentId,
    })

    if (!res) {
      this.logger.warn('No rental agreement document found', {
        contractId,
        documentId,
      })
      return undefined
    }

    return mapContractDocumentItemDto(res) ?? undefined
  }
}
