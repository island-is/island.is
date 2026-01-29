import { Inject, Injectable } from '@nestjs/common'
import { HomeApi } from '../gen/fetch'
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
    const res = await this.apiWithAuth(user).contractKtKtGet({
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
    const { contract, documents } = await this.apiWithAuth(
      user,
    ).contractContractIdWithDocumentsGet({
      contractId: id,
    })

    if (!contract || !contract.contractId) {
      this.logger.warn('Malformed contract, returning null', {
        id,
      })
      return
    }

    return mapRentalAgreementDto(contract) ?? undefined
  }

  async getRentalAgreementPdf(
    user: User,
    contractId: number,
    documentId: number,
  ): Promise<Array<ContractDocumentItemDto> | undefined> {
    const res = await this.apiWithAuth(user).contractKtKtWithDocumentsGet({
      kt: user.nationalId,
    })

    if (!res || res.length === 0) {
      this.logger.warn('No rental agreements found', {
        id,
      })
      return undefined
    }

    const data = res?.find((res) => res.contract?.contractId === id)

    if (!data) {
      this.logger.warn('Rental agreement pdf not found', {
        id,
      })
      return undefined
    }

    const pdfs = data.documents
      ?.map(mapContractDocumentItemDto)
      .filter(isDefined)

    return pdfs
  }
}
