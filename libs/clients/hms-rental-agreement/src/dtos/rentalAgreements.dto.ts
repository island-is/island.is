import { Contract, ContractDocumentItem } from '../../gen/fetch'
import { AgreementStatusType, TemporalType } from '../types'
import {
  ContractDocumentItemDto,
  mapContractDocumentItemDto,
} from './contractDocument'
import { ContractPartyDto, mapContractPartyDto } from './contractParty.dto'
import {
  ContractPropertyDto,
  mapContractPropertyDto,
} from './contractProperty.dto'
import { isDefined } from '@island.is/shared/utils'

export interface RentalAgreementDto {
  id: number
  status: AgreementStatusType
  dateFrom?: Date
  dateTo?: Date
  terminationDate?: Date
  contractType: TemporalType
  contractParty?: ContractPartyDto[]
  contractProperty?: ContractPropertyDto[]
  documents?: ContractDocumentItemDto[]
}

export const mapRentalAgreementDto = (
  contract: Contract,
): RentalAgreementDto | null => {
  if (!contract.contractId) {
    return null
  }

  const status = mapAgreementStatus(contract.contractStatus ?? undefined)

  return {
    id: contract.contractId,
    status,
    dateFrom: contract.dateFrom ? new Date(contract.dateFrom) : undefined,
    dateTo: contract.dateTo ? new Date(contract.dateTo) : undefined,
    terminationDate: contract.dateManualEnd
      ? new Date(contract.dateManualEnd)
      : undefined,
    contractType:
      contract.contractTypeUseCode === 'TEMPORARYAGREEMENT'
        ? 'temporary'
        : contract.contractTypeUseCode === 'INDEFINETEAGREEMENT'
        ? 'indefinite'
        : 'unknown',
    contractParty:
      contract.contractParty?.map(mapContractPartyDto).filter(isDefined) ??
      undefined,
    contractProperty:
      contract.contractProperty
        ?.map(mapContractPropertyDto)
        .filter(isDefined) ?? undefined,
    documents:
      contract.contractDocument
        ?.map(mapContractDocumentItemDto)
        .filter(isDefined) ?? [],
  }
}

const mapAgreementStatus = (status?: string): AgreementStatusType => {
  switch (status) {
    case 'STATUSVALID':
      return 'valid'
    case 'STATUSINVALID':
      return 'invalid'
    case 'STATUSEXPIRED':
      return 'expired'
    case 'STATUSCANCELLED':
      return 'cancelled'
    case 'STATUSTERMINATED':
      return 'terminated'
    case 'CANCELLEDREQUESTED':
      return 'cancellationRequested'
    case 'PENDINGCANCELLATION':
      return 'pendingCancellation'
    case 'PENDINGTERMINATION':
      return 'pendingTermination'
    default:
      return 'unknown'
  }
}
