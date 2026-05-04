import { type Contract, type ContractWithDocuments } from '../../gen/fetch'
import { type AgreementStatusType, type TemporalType } from '../types'
import { isDefined } from '@island.is/shared/utils'
import {
  type ContractDocumentMetadataDto,
  mapContractDocumentMetadataDto,
} from './contractDocument'
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
  contractType: TemporalType
  contractParty?: ContractPartyDto[]
  contractProperty?: ContractPropertyDto[]
  documents?: ContractDocumentMetadataDto[]
}

export const mapRentalAgreementDto = (
  contract: Contract,
): RentalAgreementDto | null => {
  if (!contract.contract_id) return null
  return {
    id: contract.contract_id,
    status: mapAgreementStatus(contract.contract_status),
    dateFrom: contract.date_from ? new Date(contract.date_from) : undefined,
    dateTo: contract.date_to ? new Date(contract.date_to) : undefined,
    terminationDate: contract.date_manual_end
      ? new Date(contract.date_manual_end)
      : undefined,
    contractType: mapTemporalType(contract.contract_type_use_code),
    contractParty:
      contract.contract_party?.map(mapContractPartyDto).filter(isDefined) ??
      undefined,
    contractProperty:
      contract.contract_property
        ?.map(mapContractPropertyDto)
        .filter(isDefined) ?? undefined,
    documents:
      contract.contract_document
        ?.map(mapContractDocumentMetadataDto)
        .filter(isDefined) ?? undefined,
  }
}

export const mapContractWithDocumentsDto = (
  data: ContractWithDocuments,
): RentalAgreementDto | null => {
  if (!data.contract) return null
  const base = mapRentalAgreementDto(data.contract)
  if (!base) return null
  return {
    ...base,
    documents:
      data.documents?.map(mapContractDocumentMetadataDto).filter(isDefined) ??
      base.documents,
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

const mapTemporalType = (typeCode?: string | null): TemporalType => {
  switch (typeCode) {
    case 'INDEFINETEAGREEMENT':
      return 'indefinite'
    case 'TEMPORARYAGREEMENT':
      return 'temporary'
    default:
      return 'unknown'
  }
}
