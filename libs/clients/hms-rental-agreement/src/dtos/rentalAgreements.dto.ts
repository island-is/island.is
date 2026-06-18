import { type Contract } from '../../gen/fetch'
import { type AgreementStatusType, type TemporalType } from '../types'
import { isDefined } from '@island.is/shared/utils'
import {
  type ContractDocumentMetadataDto,
  mapContractDocumentMetadataDto,
} from './contractDocumentMetadata.dto'
import { type ContractPartyDto, mapContractPartyDto } from './contractParty.dto'
import {
  type ContractPropertyDto,
  mapContractPropertyDto,
} from './contractProperty.dto'

export interface RentalAgreementDto {
  id: number
  status: AgreementStatusType
  dateFrom?: Date
  dateTo?: Date
  terminationDate?: Date
  signatureDate?: Date
  receivedDate?: Date
  contractType: TemporalType
  contractParty?: ContractPartyDto[]
  contractProperty?: ContractPropertyDto[]
  documents?: ContractDocumentMetadataDto[]
}

export const mapRentalAgreementDto = (
  contract: Contract,
): RentalAgreementDto | null => {
  if (!contract.contractId) return null
  return {
    id: contract.contractId,
    status: mapAgreementStatus(contract.contractStatus),
    dateFrom: contract.dateFrom ? new Date(contract.dateFrom) : undefined,
    dateTo: contract.dateTo ? new Date(contract.dateTo) : undefined,
    terminationDate: contract.dateManualEnd
      ? new Date(contract.dateManualEnd)
      : undefined,
    signatureDate: contract.signatureDate ? new Date(contract.signatureDate) : undefined,
    receivedDate: contract.receivedDate ? new Date(contract.receivedDate) : undefined,
    contractType: mapTemporalType(contract.contractTypeUseCode),
    contractParty:
      contract.contractParty?.map(mapContractPartyDto).filter(isDefined) ??
      undefined,
    contractProperty:
      contract.contractProperty
        ?.map(mapContractPropertyDto)
        .filter(isDefined) ?? undefined,
    documents:
      contract.contractDocument
        ?.map(mapContractDocumentMetadataDto)
        .filter(isDefined) ?? undefined,
  }
}

const mapTemporalType = (code?: string | null): TemporalType => {
  switch (code) {
    case 'TEMPORARYAGREEMENT':
      return 'temporary'
    case 'INDEFINETEAGREEMENT':
      return 'indefinite'
    default:
      return 'unknown'
  }
}

const mapAgreementStatus = (status?: string | null): AgreementStatusType => {
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
