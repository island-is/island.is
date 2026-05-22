import { getSlugFromType, getValueViaPath } from '@island.is/application/core'
import { ApplicationWithAttachments } from '@island.is/application/types'
import { Contract } from '@island.is/clients/hms-rental-agreement'
import { getCompletedAssigneeNationalIdSet } from '@island.is/application/templates/hms/housing-benefits'
import * as kennitala from 'kennitala'

export const normalizeNationalId = (nationalId: string): string =>
  kennitala.isValid(nationalId)
    ? kennitala.sanitize(nationalId)
    : nationalId.replace(/\D/g, '').slice(-10)

export const getApplicantName = (
  application: ApplicationWithAttachments,
): string =>
  getValueViaPath<string>(
    application.externalData,
    'nationalRegistry.data.fullName',
  )?.trim() ??
  getValueViaPath<string>(application.answers, 'applicant.name')?.trim() ??
  ''

export const getSelectedRentalContract = (
  application: ApplicationWithAttachments,
): Contract | undefined => {
  const selectedContractId = getValueViaPath<string | number>(
    application.answers,
    'rentalAgreement.answer',
  )
  if (selectedContractId === undefined || selectedContractId === '') {
    return undefined
  }
  const selectedNormalized = String(selectedContractId).trim()
  const contractsRaw = getValueViaPath<unknown>(
    application.externalData,
    'getRentalAgreements.data',
  )
  const contracts = Array.isArray(contractsRaw) ? contractsRaw : []

  return (contracts as Contract[]).find((contract) => {
    const id = contract.contractId
    if (id === undefined || id === null) return false
    return String(id).trim() === selectedNormalized
  })
}

export const getRentalAddress = (
  application: ApplicationWithAttachments,
): string => {
  const contract = getSelectedRentalContract(application)
  const property = contract?.contractProperty?.[0]
  const postalMunicipality = [property?.postalCode, property?.municipality]
    .filter(Boolean)
    .join(' ')
  return [property?.streetAndHouseNumber, postalMunicipality]
    .filter(Boolean)
    .join(', ')
}

export const getApplicationLink = (
  application: ApplicationWithAttachments,
  clientLocationOrigin: string,
): string =>
  `${clientLocationOrigin}/${getSlugFromType(application.typeId)}/${
    application.id
  }`

export const getRequestedExtraDataFiles = (
  application: ApplicationWithAttachments,
): string => {
  const requestedDocuments = getValueViaPath<string[]>(
    application.answers,
    'institutionRequestedDocuments',
  )

  return (requestedDocuments ?? []).join(',')
}

export const getRejectReason = (
  application: ApplicationWithAttachments,
): string =>
  getValueViaPath<string>(
    application.answers,
    'approveOrRejectReason',
  )?.trim() ?? ''

export const getPreviouslyNotifiedIds = (
  application: ApplicationWithAttachments,
): Set<string> =>
  new Set(
    (
      getValueViaPath<string[]>(
        application.externalData,
        'notifyAssignees.data.notifiedNationalIds',
      ) ?? []
    ).map((id) => normalizeNationalId(id)),
  )

export const isLastAssigneeToComplete = (
  application: ApplicationWithAttachments,
  nationalId: string,
): boolean => {
  const normalized = normalizeNationalId(nationalId)
  const completed = getCompletedAssigneeNationalIdSet(application)
  completed.add(normalized)
  return completed.size >= (application.assignees ?? []).length
}
