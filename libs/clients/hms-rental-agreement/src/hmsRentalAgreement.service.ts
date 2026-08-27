import { Inject, Injectable } from '@nestjs/common'
import { HomeApi } from '../gen/fetch'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { handle404 } from '@island.is/clients/middlewares'
import { isDefined } from '@island.is/shared/utils'
import {
  mapRentalAgreementDto,
  RentalAgreementDto,
} from './dtos/rentalAgreements.dto'
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
    page?: number,
    pageSize?: number,
  ): Promise<{ data: RentalAgreementDto[]; totalCount: number }> {
    const res = await this.apiWithAuth(user).contractGetRaw({
      page,
      pageSize,
      excludeInactive: hideInactiveAgreements,
    })
    const contracts = await res.value()

    const totalCountHeader = res.raw.headers.get('x-total-count')
    const totalCount = totalCountHeader
      ? Number(totalCountHeader)
      : contracts.length

    const data = contracts.map(mapRentalAgreementDto).filter(isDefined)

    return {
      data,
      totalCount: Number.isNaN(totalCount) ? data.length : totalCount,
    }
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

  async getLatestRentalAgreementPdf(
    user: User,
    contractId: string,
  ): Promise<ContractDocumentItemDto | undefined> {
    const res = await this.apiWithAuth(user)
      .contractContractIdLatestPdfGet({ contractId })
      .catch(handle404)

    if (!res) {
      this.logger.warn('No rental agreement document found', {
        contractId,
      })
      return undefined
    }

    return mapContractDocumentItemDto(res) ?? undefined
  }

  async getRentalAgreementDocumentPdf(
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
