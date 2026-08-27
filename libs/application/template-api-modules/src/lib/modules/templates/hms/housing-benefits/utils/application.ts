import { getValueViaPath, YES } from '@island.is/application/core'
import { ApplicationWithAttachments } from '@island.is/application/types'
import { Contract } from '@island.is/clients/hms-rental-agreement'
import {
  ApplicationFile,
  ApplicationFileType,
  HouseholdMember,
  HousingBenefitsApplicationModel,
  PropertyType,
} from '@island.is/clients/hms-housing-benefits'
import {
  getCompletedAssigneeNationalIdSet,
  getRejectedAssigneeNationalIdsFromAnswers,
} from '@island.is/application/templates/hms/housing-benefits'
import * as kennitala from 'kennitala'

export const normalizePhoneNumber = (phoneNumber: string): string => {
  return phoneNumber
    .trim()
    .replace(/(^00354|^\+354)/g, '') // Remove country code
    .replace(/\D/g, '') // Remove all non-digits
}

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

export type ApplicationFileEntry = {
  key: string
  name: string
  kennitala: string
  fileType?: ApplicationFileType
}

const EXEMPTION_REASON_TO_FILE_TYPE: Record<string, ApplicationFileType> = {
  studies: ApplicationFileType.SchoolCertificate,
  health: ApplicationFileType.MedicalCertificate,
  work: ApplicationFileType.EmploymentContract,
}

const ATTACHMENT_URL_EXPIRY_SECONDS = 3600

const addUploadedFiles = (
  files: UploadedFile[] | undefined,
  kennitala: string,
  fileType: ApplicationFileType | undefined,
  collected: Map<string, ApplicationFileEntry>,
) => {
  if (!Array.isArray(files)) {
    return
  }

  for (const file of files) {
    if (!file?.key || !file?.name) {
      continue
    }
    collected.set(file.key, {
      key: file.key,
      name: file.name,
      kennitala,
      ...(fileType ? { fileType } : {}),
    })
  }
}

const addAccessAgreementRepeaterFiles = (
  answers: ApplicationWithAttachments['answers'],
  repeaterPath: string,
  kennitala: string,
  collected: Map<string, ApplicationFileEntry>,
) => {
  const rows = getValueViaPath<Array<{ file?: UploadedFile[] }> | undefined>(
    answers,
    repeaterPath,
  )

  if (!Array.isArray(rows)) {
    return
  }

  for (const row of rows) {
    addUploadedFiles(
      row.file,
      kennitala,
      ApplicationFileType.VisitationAgreement,
      collected,
    )
  }
}

const getOptionalDescription = (
  answers: ApplicationWithAttachments['answers'],
  path: string,
): string | undefined => {
  const value = getValueViaPath<string>(answers, path)?.trim()
  return value ? value : undefined
}

const getAssigneeHouseholdMemberFieldsFromAnswers = (
  answers: ApplicationWithAttachments['answers'],
  nationalId: string,
): Pick<
  HouseholdMember,
  | 'email'
  | 'phoneNumber'
  | 'address'
  | 'postalCode'
  | 'acceptedMunicipalityDataFetch'
  | 'acceptedDataFetch'
  | 'acceptedPrivacyPolicy'
  | 'assetDeclaration'
  | 'incomeDeclaration'
> => {
  const normalizedId = normalizeNationalId(nationalId)
  const email = getValueViaPath<string>(
    answers,
    `${normalizedId}.assigneeInfo.email`,
  )?.trim()
  const phoneNumber = normalizePhoneNumber(
    getValueViaPath<string>(
      answers,
      `${normalizedId}.assigneeInfo.phoneNumber`,
    )?.trim() ?? '',
  )
  const address = getValueViaPath<string>(
    answers,
    `${normalizedId}.assigneeInfo.address`,
  )?.trim()
  const postalCode = getValueViaPath<string>(
    answers,
    `${normalizedId}.assigneeInfo.postalCode`,
  )?.trim()
  const municipalityConsent = getValueViaPath<string>(
    answers,
    `${normalizedId}.confirmMunicipalityDataFetch[0]`,
  )
  const approvedExternalData = getValueViaPath<boolean>(
    answers,
    `${normalizedId}.approveExternalData`,
  )
  const assetDeclaration = getValueViaPath<string>(
    answers,
    `${normalizedId}.assetDeclerationTextField`,
  )?.trim()
  const incomeDeclaration = getValueViaPath<string>(
    answers,
    `${normalizedId}.incomeDeclarationTextField`,
  )?.trim()
  return {
    ...(email ? { email } : {}),
    ...(phoneNumber ? { phoneNumber } : {}),
    ...(address ? { address } : {}),
    ...(postalCode ? { postalCode } : {}),
    ...(municipalityConsent === YES
      ? { acceptedMunicipalityDataFetch: true }
      : {}),
    ...(approvedExternalData === true ? { acceptedDataFetch: true } : {}),
    acceptedPrivacyPolicy: true,
    ...(assetDeclaration ? { assetDeclaration } : {}),
    ...(incomeDeclaration ? { incomeDeclaration } : {}),
  }
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

  const rejected = new Set(
    getRejectedAssigneeNationalIdsFromAnswers(application.answers).map(
      normalizeNationalId,
    ),
  )

  return rows
    .filter((row) => !row.isRemoved)
    .map((row) => row.nationalIdWithName?.nationalId)
    .filter((id): id is string => Boolean(id))
    .filter((id) => !rejected.has(normalizeNationalId(id)))
    .map((id) => ({
      kennitala: normalizeNationalId(id),
      ...getAssigneeHouseholdMemberFieldsFromAnswers(application.answers, id),
    }))
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

/** Collects uploaded file metadata from application answers. */
export const collectApplicationFileEntries = (
  application: ApplicationWithAttachments,
  applicantKennitala: string,
): ApplicationFileEntry[] => {
  const { answers } = application
  const collected = new Map<string, ApplicationFileEntry>()

  const exemptionReason = getValueViaPath<string>(answers, 'exemptionReason')
  if (exemptionReason && exemptionReason !== 'housing') {
    addUploadedFiles(
      getValueViaPath<UploadedFile[]>(
        answers,
        `exemptionDocuments.${exemptionReason}`,
      ),
      applicantKennitala,
      EXEMPTION_REASON_TO_FILE_TYPE[exemptionReason],
      collected,
    )
  }

  addAccessAgreementRepeaterFiles(
    answers,
    'mainFormAccessAgreementRepeater',
    applicantKennitala,
    collected,
  )

  const householdRows = getValueViaPath<
    Array<{
      nationalIdWithName?: { nationalId?: string }
      isRemoved?: boolean
      file?: UploadedFile[]
    }>
  >(answers, 'householdMembersTableRepeater')
  if (Array.isArray(householdRows)) {
    for (const row of householdRows) {
      if (row.isRemoved) {
        continue
      }
      const rowKennitala = row.nationalIdWithName?.nationalId
        ? normalizeNationalId(row.nationalIdWithName.nationalId)
        : applicantKennitala
      addUploadedFiles(
        row.file,
        rowKennitala,
        ApplicationFileType.VisitationAgreement,
        collected,
      )
    }
  }

  for (const [nationalId, value] of Object.entries(answers)) {
    if (!kennitala.isValid(nationalId) || typeof value !== 'object' || !value) {
      continue
    }

    const assigneeKennitala = normalizeNationalId(nationalId)
    const bucket = value as ApplicationWithAttachments['answers']

    addAccessAgreementRepeaterFiles(
      bucket,
      'assigneeAccessAgreementRepeater',
      assigneeKennitala,
      collected,
    )
    addAccessAgreementRepeaterFiles(
      bucket,
      'applicantSubmitAccessAgreementRepeater',
      assigneeKennitala,
      collected,
    )

    const legacyFiles = getValueViaPath<UploadedFile[]>(
      bucket,
      'assigneeUmgengnissamningurFile',
    )
    addUploadedFiles(
      legacyFiles,
      assigneeKennitala,
      ApplicationFileType.VisitationAgreement,
      collected,
    )
  }

  const extraDataAttachments = getValueViaPath<
    Partial<Record<string, UploadedFile[]>>
  >(answers, 'extraDataAttachments')
  if (extraDataAttachments) {
    addUploadedFiles(
      extraDataAttachments.custodyAgreement,
      applicantKennitala,
      ApplicationFileType.VisitationAgreement,
      collected,
    )
    addUploadedFiles(
      extraDataAttachments.exemptionReason,
      applicantKennitala,
      exemptionReason
        ? EXEMPTION_REASON_TO_FILE_TYPE[exemptionReason]
        : undefined,
      collected,
    )
    addUploadedFiles(
      extraDataAttachments.changedCircumstances,
      applicantKennitala,
      undefined,
      collected,
    )
  }

  return Array.from(collected.values())
}

/** Resolves presigned S3 URLs for collected files before HMS submission. */
export const resolveApplicationFilesForSubmission = async (
  application: ApplicationWithAttachments,
  applicantKennitala: string,
  getAttachmentUrl: (
    application: ApplicationWithAttachments,
    attachmentKey: string,
    expiration: number,
  ) => Promise<string>,
): Promise<ApplicationFile[]> => {
  const entries = collectApplicationFileEntries(application, applicantKennitala)

  return Promise.all(
    entries.map(async ({ key, name, kennitala: fileKennitala, fileType }) => ({
      kennitala: fileKennitala,
      fileName: name,
      fileUrl: await getAttachmentUrl(
        application,
        key,
        ATTACHMENT_URL_EXPIRY_SECONDS,
      ),
      ...(fileType ? { fileType } : {}),
    })),
  )
}

export const mapApplicationToHousingBenefitsModel = (
  application: ApplicationWithAttachments,
  files: ApplicationFile[] = [],
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

  const hasAssetsAndIncome = Boolean(
    getValueViaPath<string>(answers, 'assetsDeclarationTextField')?.trim(),
  )

  const acceptedMunicipalityDataFetch =
    getValueViaPath<string>(answers, 'confirmMunicipality[0]') === YES
  const acceptedDataFetch =
    getValueViaPath<boolean>(answers, 'approveExternalData') === true
  const acceptedPrivacyPolicy =
    getValueViaPath<string[]>(answers, 'confirmRead.privacyPolicy')?.includes(
      YES,
    ) ?? false

  return {
    kennitala: applicantKennitala,
    address: getValueViaPath<string>(answers, 'applicant.address') ?? '',
    municipality: getValueViaPath<string>(answers, 'applicant.city') ?? '',
    postalCode: getValueViaPath<string>(answers, 'applicant.postalCode') ?? '',
    islandIsDateRegistered: new Date(),

    phoneNumber: normalizePhoneNumber(
      getValueViaPath<string>(answers, 'applicant.phoneNumber') ?? '',
    ),
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
    householdMembers: [
      {
        kennitala: applicantKennitala,
        email: getValueViaPath<string>(answers, 'applicant.email') ?? '',
        phoneNumber: normalizePhoneNumber(
          getValueViaPath<string>(answers, 'applicant.phoneNumber') ?? '',
        ),
        acceptedPrivacyPolicy,
        acceptedMunicipalityDataFetch,
        acceptedDataFetch,
        assetDeclaration:
          getValueViaPath<string>(
            answers,
            'assetsDeclarationTextField',
          )?.trim() ?? undefined,
        incomeDeclaration:
          getValueViaPath<string>(
            answers,
            'incomeNoTaxReturnDescription',
          )?.trim() ?? undefined,
      },
      ...getHouseholdMembersForSubmission(application),
    ],
    propertyTypeNumber: PropertyType.PrivatelyOwned,
    files,
  }
}
