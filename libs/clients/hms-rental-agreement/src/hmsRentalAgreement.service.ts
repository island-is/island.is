import { Inject, Injectable } from '@nestjs/common'
import { User, withAuthContext } from '@island.is/auth-nest-tools'
import { dataOr404Null } from '@island.is/clients/middlewares'
import {
  getContract,
  getContractByContractIdWithDocuments,
  getContractByContractIdDocumentByDocumentId,
} from '../gen/fetch'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { isDefined } from '@island.is/shared/utils'
import { INACTIVE_AGREEMENT_STATUSES } from './constants'
import {
  type RentalAgreementDto,
  type ContractDocumentItemDto,
  mapRentalAgreementDto,
  mapContractWithDocumentsDto,
  mapContractDocumentItemDto,
} from './dtos'

@Injectable()
export class HmsRentalAgreementService {
  constructor(@Inject(LOGGER_PROVIDER) private readonly logger: Logger) {}

  async getRentalAgreements(
    user: User,
    hideInactiveAgreements = false,
  ): Promise<RentalAgreementDto[]> {
    const contracts =
      (await withAuthContext(user, () => dataOr404Null(getContract()))) ?? []

    const dtos = contracts?.map(mapRentalAgreementDto).filter(isDefined)

    if (hideInactiveAgreements) {
      const inactiveSet = new Set<string>(INACTIVE_AGREEMENT_STATUSES)
      return dtos.filter((dto) => !inactiveSet.has(dto.status))
    }
    return dtos
  }

  async getRentalAgreement(
    user: User,
    id: string,
  ): Promise<RentalAgreementDto | undefined> {
    const res = await withAuthContext(user, () =>
      dataOr404Null(
        getContractByContractIdWithDocuments({ path: { contractId: id } }),
      ),
    )

    if (!res?.contract?.contract_id) {
      this.logger.warn('Rental agreement not found', { id })
      return undefined
    }

    return mapContractWithDocumentsDto(res) ?? undefined
  }

  async getRentalAgreementPdf(
    user: User,
    contractId: number,
    documentId: number,
  ): Promise<ContractDocumentItemDto | undefined> {
    const res = await withAuthContext(user, () =>
      dataOr404Null(
        getContractByContractIdDocumentByDocumentId({
          path: { contractId, documentId },
        }),
      ),
    )

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
