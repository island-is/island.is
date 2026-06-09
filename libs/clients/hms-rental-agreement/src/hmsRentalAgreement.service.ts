import { Inject, Injectable } from '@nestjs/common'
import { HomeApi } from '../gen/fetch'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { handle404 } from '@island.is/clients/middlewares'
import { isDefined } from '@island.is/shared/utils'
import {
  mapRentalAgreementDto,
  RentalAgreementDto,
} from './dtos/rentalAgreements.dto'
import {
  AGREEMENT_STATUS_ORDER,
  INACTIVE_AGREEMENT_STATUSES,
} from './constants'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import {
  ContractDocumentItemDto,
  mapContractDocumentItemDto,
} from './dtos/contractDocument'

@Injectable()
export class HmsRentalAgreementService {
  constructor(
    private readonly api: HomeApi,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private apiWithAuth = (user: User) =>
    this.api.withMiddleware(new AuthMiddleware(user as Auth))

  async getRentalAgreements(
    user: User,
    hideInactiveAgreements = false,
  ): Promise<RentalAgreementDto[]> {
    const res = await this.apiWithAuth(user).contractGet()

    const data = res
      .map(mapRentalAgreementDto)
      .filter(isDefined)
      .sort(
        (a, b) =>
          AGREEMENT_STATUS_ORDER.indexOf(a.status) -
          AGREEMENT_STATUS_ORDER.indexOf(b.status),
      )

    if (hideInactiveAgreements) {
      return data.filter((d) => !INACTIVE_AGREEMENT_STATUSES.includes(d.status))
    }
    return data
  }

  async getRentalAgreement(
    user: User,
    id: string,
  ): Promise<RentalAgreementDto | undefined> {
    const res = await this.apiWithAuth(user)
      .contractContractIdGet({ contractId: id })
      .catch(handle404)

    if (!res?.contractId) {
      this.logger.warn('Rental agreement not found', { id })
      return undefined
    }

    return mapRentalAgreementDto(res) ?? undefined
  }

  async getRentalAgreementPdf(
    user: User,
    contractId: number,
    documentId: number,
  ): Promise<ContractDocumentItemDto | undefined> {
    const res = await this.apiWithAuth(user)
      .contractContractIdDocumentDocumentIdGet({ contractId, documentId })
      .catch(handle404)

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
