import {
  getSlugFromType,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import { ApplicationWithAttachments } from '@island.is/application/types'
import { Contract } from '@island.is/clients/hms-rental-agreement'
import {
  ApplicationFile,
  HouseholdMember,
  HousingBenefitsApplicationModel,
} from '@island.is/clients/hms-housing-benefits'
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

type UploadedFile = { key: string; name: string }

const getOptionalDescription = (
  answers: ApplicationWithAttachments['answers'],
  path: string,
): string | undefined => {
  const value = getValueViaPath<string>(answers, path)?.trim()
  return value ? value : undefined
}

const getHouseholdMembersForSubmission = (
  application: ApplicationWithAttachments,
): Array<HouseholdMember> => {
  const rows = getValueViaPath<
    Array<{
      nationalIdWithName?: { nationalId?: string }
      isRemoved?: boolean
    }>
  >(application.answers, 'householdMembersTableRepeater')

  if (!Array.isArray(rows)) {
    return []
  }

  return rows
    .filter((row) => !row.isRemoved)
    .map((row) => row.nationalIdWithName?.nationalId)
    .filter((id): id is string => Boolean(id))
    .map((id) => ({ kennitala: normalizeNationalId(id) }))
}

const getSelectedLandlordKennitala = (
  application: ApplicationWithAttachments,
): string | undefined => {
  const contract = getSelectedRentalContract(application)
  const landlords =
    contract?.contractParty?.filter(
      (party) =>
        party.partyTypeUseCode === 'OWNER' &&
        (party.kennitala || party.contractPartyId),
    ) ?? []

  if (landlords.length === 0) {
    return undefined
  }

  const selectedValue = getValueViaPath<string>(
    application.answers,
    'payment.landlordSelection',
  )

  const landlord = selectedValue
    ? landlords.find(
        (party) =>
          party.kennitala === selectedValue ||
          party.contractPartyId?.toString() === selectedValue,
      )
    : landlords.length === 1
    ? landlords[0]
    : undefined

  return landlord?.kennitala
    ? normalizeNationalId(landlord.kennitala)
    : undefined
}

/**
 * Collects uploaded files from the application into the HMS file shape.
 * Note: fileUrl/fileType are intentionally left undefined until the HMS
 * file-transfer contract (signed URLs vs. upload step) is confirmed.
 */
const getApplicationFilesForSubmission = (
  application: ApplicationWithAttachments,
  applicantKennitala: string,
): Array<ApplicationFile> => {
  const { answers } = application
  const collected: UploadedFile[] = []

  const exemptionReason = getValueViaPath<string>(answers, 'exemptionReason')
  if (exemptionReason) {
    const exemptionFiles = getValueViaPath<UploadedFile[]>(
      answers,
      `exemptionDocuments.${exemptionReason}`,
    )
    if (Array.isArray(exemptionFiles)) {
      collected.push(...exemptionFiles)
    }
  }

  const simpleFilePaths = [
    'incomeContractorFiles',
    'incomeForeignFiles',
    'incomeOtherFiles',
    'incomeNoTaxReturnFiles',
  ]
  simpleFilePaths.forEach((path) => {
    const files = getValueViaPath<UploadedFile[]>(answers, path)
    if (Array.isArray(files)) {
      collected.push(...files)
    }
  })

  const householdRows = getValueViaPath<Array<{ file?: UploadedFile[] }>>(
    answers,
    'householdMembersTableRepeater',
  )
  if (Array.isArray(householdRows)) {
    householdRows.forEach((row) => {
      if (Array.isArray(row.file)) {
        collected.push(...row.file)
      }
    })
  }

  return collected
    .filter((file) => file?.name)
    .map((file) => ({
      kennitala: applicantKennitala,
      fileName: file.name,
    }))
}

export const mapApplicationToHousingBenefitsModel = (
  application: ApplicationWithAttachments,
): HousingBenefitsApplicationModel => {
  const { answers } = application

  const applicantKennitala = normalizeNationalId(
    getValueViaPath<string>(answers, 'applicant.nationalId') ??
      application.applicant,
  )

  const bankAccount = getValueViaPath<{
    bankNumber?: string
    ledger?: string
    accountNumber?: string
  }>(answers, 'applicant.bankAccount')

  const contract = getSelectedRentalContract(application)
  const property = contract?.contractProperty?.[0]

  const hasOtherIncome =
    getValueViaPath<string>(answers, 'incomeHasOtherIncome') === YES

  const payToLandlord =
    getValueViaPath<string>(answers, 'payment.paymentRadio') === 'landlord'

  const landlordBankAccount = getValueViaPath<{
    bankNumber?: string
    ledger?: string
    accountNumber?: string
  }>(answers, 'payment.landlordBankAccount')

  const hasAssetsAndIncome =
    getValueViaPath<string>(answers, 'assetsDeclarationRadio') === YES

  return {
    kennitala: applicantKennitala,
    address: getValueViaPath<string>(answers, 'applicant.address') ?? '',
    municipality: getValueViaPath<string>(answers, 'applicant.city') ?? '',
    postalCode: getValueViaPath<string>(answers, 'applicant.postalCode') ?? '',
    islandIsDateRegistered: new Date(),
    phoneNumber: getValueViaPath<string>(answers, 'applicant.phoneNumber') ?? '',
    email: getValueViaPath<string>(answers, 'applicant.email') ?? '',
    bank: bankAccount?.bankNumber ?? '',
    ledger: bankAccount?.ledger ?? '',
    accountNumber: bankAccount?.accountNumber ?? '',
    leaseContractNumber: Number(contract?.contractId ?? 0),
    propertyNumber:
      property?.propertyId !== undefined && property?.propertyId !== null
        ? String(property.propertyId)
        : undefined,
    foreignIncome: hasOtherIncome
      ? getOptionalDescription(answers, 'incomeForeignDescription')
      : undefined,
    contractorIncome: hasOtherIncome
      ? getOptionalDescription(answers, 'incomeContractorDescription')
      : undefined,
    otherIncome: hasOtherIncome
      ? getOptionalDescription(answers, 'incomeOtherDescription')
      : undefined,
    payToLandlord: payToLandlord ? 1 : 0,
    landlordBankAccountOwnerKennitala: payToLandlord
      ? getSelectedLandlordKennitala(application)
      : undefined,
    landlordBank: payToLandlord ? landlordBankAccount?.bankNumber : undefined,
    landlordLedger: payToLandlord ? landlordBankAccount?.ledger : undefined,
    landlordAccountNumber: payToLandlord
      ? landlordBankAccount?.accountNumber
      : undefined,
    hasAssetsAndIncome: hasAssetsAndIncome ? 1 : 0,
    householdMembers: getHouseholdMembersForSubmission(application),
    files: getApplicationFilesForSubmission(application, applicantKennitala),
  }
}
