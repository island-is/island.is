import { getValueViaPath, YES } from '@island.is/application/core'
import {
  Application,
  AttachmentItem,
  ExternalData,
  FormValue,
  KeyValueItem,
} from '@island.is/application/types'
import { Locale } from '@island.is/shared/types'
import {
  format as formatKennitala,
  sanitize as sanitizeKennitala,
} from 'kennitala'
import {
  formatBankInfo,
  formatPhoneNumberWithIcelandicCountryCode,
} from '@island.is/application/ui-components'
import * as m from '../lib/messages'
import {
  doesAssigneeAddressMatchRentalContract,
  getHouseholdMembersForTable,
  getSelectedContract,
  getSelectedLandlordForPayment,
} from './rentalAgreementUtils'

const formatBankAccount = (
  bankAccount:
    | { bankNumber?: string; ledger?: string; accountNumber?: string }
    | undefined,
): string => {
  if (!bankAccount) return ''
  const combined =
    (bankAccount.bankNumber ?? '') +
    (bankAccount.ledger ?? '') +
    (bankAccount.accountNumber ?? '')
  return combined.length === 12 ? formatBankInfo(combined) : combined
}

export const personalInformationOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
  _userNationalId?: string,
  _locale?: Locale,
): Array<KeyValueItem> => {
  return [
    {
      width: 'full',
      keyText: m.draftMessages.overviewSection.name,
      valueText: getValueViaPath<string>(answers, 'applicant.name') ?? '',
    },
    {
      width: 'half',
      keyText: m.draftMessages.overviewSection.nationalId,
      valueText: formatKennitala(
        getValueViaPath<string>(answers, 'applicant.nationalId') ?? '',
      ),
    },
    {
      width: 'half',
      keyText: m.draftMessages.overviewSection.address,
      valueText: getValueViaPath<string>(answers, 'applicant.address') ?? '',
    },
    {
      width: 'half',
      keyText: m.draftMessages.overviewSection.postalCode,
      valueText: getValueViaPath<string>(answers, 'applicant.postalCode') ?? '',
    },
    {
      width: 'half',
      keyText: m.draftMessages.overviewSection.city,
      valueText: getValueViaPath<string>(answers, 'applicant.city') ?? '',
    },
    {
      width: 'half',
      keyText: m.draftMessages.overviewSection.email,
      valueText: getValueViaPath<string>(answers, 'applicant.email') ?? '',
    },
    {
      width: 'half',
      keyText: m.draftMessages.overviewSection.phoneNumber,
      valueText: formatPhoneNumberWithIcelandicCountryCode(
        getValueViaPath<string>(answers, 'applicant.phoneNumber') ?? '',
      ),
    },
    {
      width: 'full',
      keyText: m.draftMessages.overviewSection.bankAccount,
      valueText: formatBankAccount(
        getValueViaPath<{
          bankNumber?: string
          ledger?: string
          accountNumber?: string
        }>(answers, 'applicant.bankAccount'),
      ),
    },
  ]
}

export const rentalAgreementOverviewItems = (
  answers: FormValue,
  externalData: ExternalData,
  _userNationalId?: string,
  _locale?: Locale,
): Array<KeyValueItem> => {
  const contract = getSelectedContract(answers, externalData)
  const contractProperty = contract?.contractProperty?.[0]
  const landlords = contract?.contractParty
    ?.filter((p) => p.partyTypeUseCode === 'OWNER')
    .map((p) => p.name)
    .join(', ')
  const renters = contract?.contractParty
    ?.filter((p) => p.partyTypeUseCode === 'TENANT')
    .map((p) => p.name)
    .join(', ')

  return [
    {
      width: 'half',
      keyText: m.draftMessages.overviewSection.contractId,
      valueText: contract?.contractId?.toString() ?? '',
    },
    {
      width: 'half',
      keyText: m.draftMessages.overviewSection.address,
      valueText: contractProperty?.streetAndHouseNumber ?? '',
    },
    {
      width: 'half',
      keyText: m.draftMessages.overviewSection.landlords,
      valueText: landlords ?? '',
    },
    {
      width: 'half',
      keyText: m.draftMessages.overviewSection.renters,
      valueText: renters ?? '',
    },
  ]
}

export const exemptionSectionOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
  _userNationalId?: string,
  _locale?: Locale,
): Array<KeyValueItem> => {
  const exemptionReason = getValueViaPath<string>(answers, 'exemptionReason')
  const exemptionCheckbox = getValueViaPath<string[]>(
    answers,
    'exemptionCheckbox',
  )
  const hasExemption =
    Array.isArray(exemptionCheckbox) && exemptionCheckbox.includes('yes')

  if (!hasExemption || !exemptionReason) {
    return [
      {
        width: 'full',
        keyText: m.draftMessages.overviewSection.exemptionStatus,
        valueText: m.draftMessages.overviewSection.noExemption,
      },
    ]
  }

  const reasonLabels: Record<
    string,
    typeof m.draftMessages.exemptionSection['checkboxLabelStudies']
  > = {
    studies: m.draftMessages.exemptionSection.checkboxLabelStudies,
    health: m.draftMessages.exemptionSection.checkboxLabelHealth,
    housing: m.draftMessages.exemptionSection.checkboxLabelHousing,
    work: m.draftMessages.exemptionSection.checkboxLabelWork,
  }

  const items: Array<KeyValueItem> = [
    {
      width: 'full',
      keyText: m.draftMessages.overviewSection.exemptionReason,
      valueText: reasonLabels[exemptionReason] ?? exemptionReason,
    },
  ]

  return items
}

export const exemptionSectionOverviewAttachments = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<AttachmentItem> => {
  const exemptionReason = getValueViaPath<string>(answers, 'exemptionReason')
  const exemptionCheckbox = getValueViaPath<string[]>(
    answers,
    'exemptionCheckbox',
  )
  const hasExemption =
    Array.isArray(exemptionCheckbox) && exemptionCheckbox.includes('yes')

  if (!hasExemption || !exemptionReason) return []

  const files = getValueViaPath<Array<{ key: string; name: string }>>(
    answers,
    `exemptionDocuments.${exemptionReason}`,
  )

  if (!Array.isArray(files) || files.length === 0) return []

  return files.map((file) => ({
    width: 'full' as const,
    fileName: file.name,
    fileType: file.name?.split('.').pop(),
  }))
}

type HouseholdMember = {
  name: string
  nationalId: string
}

const getMembersFromAnswers = (
  answers: FormValue,
): Array<HouseholdMember & { file?: Array<{ key: string; name: string }> }> => {
  const rows = getValueViaPath<
    Array<{
      nationalIdWithName?: { name?: string; nationalId?: string }
      file?: Array<{ key: string; name: string }>
    }>
  >(answers, 'householdMembersTableRepeater')

  if (!Array.isArray(rows)) return []

  return rows
    .filter((row) => !(row as { isRemoved?: boolean }).isRemoved)
    .map((row) => {
      const nested = row.nationalIdWithName
      const name =
        (typeof nested === 'object' && nested !== null && 'name' in nested
          ? nested.name
          : null) ?? ''
      const nationalId =
        (typeof nested === 'object' && nested !== null && 'nationalId' in nested
          ? nested.nationalId
          : null) ?? ''
      return {
        name,
        nationalId,
        file: Array.isArray(row.file) ? row.file : undefined,
      }
    })
    .filter((member) => member.nationalId || member.name)
}

export const householdMembersOverviewItems = (
  answers: FormValue,
  externalData: ExternalData,
  _userNationalId?: string,
  _locale?: Locale,
): Array<KeyValueItem> => {
  const contractMembers = getHouseholdMembersForTable({
    answers,
    externalData,
  } as Application)
  const answerMembers = getMembersFromAnswers(answers)

  const normalizeId = (id: string) => (id ?? '').replace(/\D/g, '')
  const contractNationalIds = new Set(
    contractMembers.map((cm) => normalizeId(cm.nationalId)).filter(Boolean),
  )
  const answerByNationalId = new Map(
    answerMembers.map((am) => [normalizeId(am.nationalId), am]),
  )

  const members: Array<HouseholdMember> = []
  contractMembers.forEach((cm) => {
    members.push({ name: cm.name, nationalId: cm.nationalId })
  })
  answerMembers.forEach((am) => {
    if (am.nationalId && !contractNationalIds.has(normalizeId(am.nationalId))) {
      members.push({ name: am.name, nationalId: am.nationalId })
    }
  })

  if (members.length === 0) {
    return [
      {
        width: 'full',
        keyText: m.draftMessages.overviewSection.householdMembers,
        valueText: '-',
      },
    ]
  }

  return members.map((member) => {
    const answerRow = answerByNationalId.get(normalizeId(member.nationalId))
    const displayName = answerRow?.name || member.name
    const displayNationalId = answerRow?.nationalId || member.nationalId
    return {
      width: 'full' as const,
      keyText: displayName,
      valueText: displayNationalId ? formatKennitala(displayNationalId) : '',
    }
  })
}

export const householdMembersOverviewAttachments = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<AttachmentItem> => {
  const answerMembers = getMembersFromAnswers(answers)
  const attachments: Array<AttachmentItem> = []

  answerMembers.forEach((member) => {
    if (member.file && Array.isArray(member.file) && member.file.length > 0) {
      member.file.forEach((file) => {
        attachments.push({
          width: 'full' as const,
          fileName: `${member.name || member.nationalId}: ${file.name}`,
          fileType: file.name?.split('.').pop(),
        })
      })
    }
  })

  return attachments
}

export const incomeSectionOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
  _userNationalId?: string,
  _locale?: Locale,
): Array<KeyValueItem> => {
  if (getValueViaPath<string>(answers, 'incomeHasOtherIncome') !== YES) {
    return []
  }

  const items: KeyValueItem[] = []

  const contractorText = getValueViaPath<string>(
    answers,
    'incomeContractorDescription',
  )?.trim()
  if (contractorText) {
    items.push({
      width: 'full',
      keyText: m.draftMessages.incomeSection.contractorDescriptionTitle,
      valueText: contractorText,
    })
  }

  const foreignText = getValueViaPath<string>(
    answers,
    'incomeForeignDescription',
  )?.trim()
  if (foreignText) {
    items.push({
      width: 'full',
      keyText: m.draftMessages.incomeSection.foreignDescriptionTitle,
      valueText: foreignText,
    })
  }

  const otherText = getValueViaPath<string>(
    answers,
    'incomeOtherDescription',
  )?.trim()
  if (otherText) {
    items.push({
      width: 'full',
      keyText: m.draftMessages.incomeSection.otherDescriptionTitle,
      valueText: otherText,
    })
  }

  return items
}

const appendIncomeFiles = (
  answers: FormValue,
  path: string,
  label: string,
  out: AttachmentItem[],
) => {
  const files = getValueViaPath<Array<{ key: string; name: string }>>(
    answers,
    path,
  )
  if (!Array.isArray(files)) return
  files.forEach((file) => {
    out.push({
      width: 'full',
      fileName: `${label}: ${file.name}`,
      fileType: file.name?.split('.').pop(),
    })
  })
}

export const incomeSectionOverviewAttachments = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<AttachmentItem> => {
  if (getValueViaPath<string>(answers, 'incomeHasOtherIncome') !== YES) {
    return []
  }

  const attachments: AttachmentItem[] = []
  appendIncomeFiles(
    answers,
    'incomeContractorFiles',
    'Verktakagreiðslur',
    attachments,
  )
  appendIncomeFiles(
    answers,
    'incomeForeignFiles',
    'Erlendar greiðslur',
    attachments,
  )
  appendIncomeFiles(answers, 'incomeOtherFiles', 'Aðrar greiðslur', attachments)

  return attachments
}

export const incomeNoTaxReturnOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
  _userNationalId?: string,
  _locale?: Locale,
): Array<KeyValueItem> => {
  const description = getValueViaPath<string>(
    answers,
    'incomeNoTaxReturnDescription',
  )?.trim()

  if (!description) return []

  return [
    {
      width: 'full',
      keyText: m.draftMessages.incomeNoTaxReturnSection.descriptionTitle,
      valueText: description,
    },
  ]
}

export const incomeNoTaxReturnOverviewAttachments = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<AttachmentItem> => {
  const files = getValueViaPath<Array<{ key: string; name: string }>>(
    answers,
    'incomeNoTaxReturnFiles',
  )
  if (!Array.isArray(files)) return []
  return files.map((file) => ({
    width: 'full' as const,
    fileName: file.name,
    fileType: file.name?.split('.').pop(),
  }))
}

export const assetsDeclarationOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
  _userNationalId?: string,
  _locale?: Locale,
): Array<KeyValueItem> => {
  const hasAssets =
    getValueViaPath<string>(answers, 'assetsDeclarationRadio') === YES

  const items: Array<KeyValueItem> = [
    {
      width: 'full',
      keyText: m.draftMessages.assetsDeclarationSection.radioTitle,
      valueText: hasAssets
        ? m.draftMessages.assetsDeclarationSection.optionYes
        : m.draftMessages.assetsDeclarationSection.optionNo,
    },
  ]

  if (hasAssets) {
    const description =
      getValueViaPath<string>(answers, 'assetsDeclarationTextField')?.trim() ??
      ''
    if (description) {
      items.push({
        width: 'full',
        keyText: m.draftMessages.assetsDeclarationSection.textFieldDescription,
        valueText: description,
      })
    }
  }

  return items
}

export const paymentSectionOverviewItems = (
  answers: FormValue,
  externalData: ExternalData,
  _userNationalId?: string,
  _locale?: Locale,
): Array<KeyValueItem> => {
  const paymentRadio = getValueViaPath<string>(answers, 'payment.paymentRadio')
  const isLandlord = paymentRadio === 'landlord'

  const landlordBankAccount = getValueViaPath<{
    bankNumber?: string
    ledger?: string
    accountNumber?: string
  }>(answers, 'payment.landlordBankAccount')

  if (isLandlord) {
    const landlord = getSelectedLandlordForPayment(answers, externalData)
    if (landlord) {
      return [
        {
          width: 'full',
          keyText: m.draftMessages.overviewSection.name,
          valueText: landlord.name,
        },
        {
          width: 'half',
          keyText: m.draftMessages.overviewSection.nationalId,
          valueText: landlord.nationalId
            ? formatKennitala(landlord.nationalId)
            : '',
        },
        {
          width: 'half',
          keyText: m.draftMessages.paymentSection.landlordBankAccountTitle,
          valueText: formatBankAccount(landlordBankAccount),
        },
      ]
    }
    return [
      {
        width: 'half',
        keyText: m.draftMessages.overviewSection.paymentRecipient,
        valueText: m.draftMessages.paymentSection.optionLandlord,
      },
      {
        width: 'half',
        keyText: m.draftMessages.paymentSection.landlordBankAccountTitle,
        valueText: formatBankAccount(landlordBankAccount),
      },
    ]
  }

  return [
    {
      width: 'full',
      keyText: m.draftMessages.overviewSection.paymentRecipient,
      valueText: m.draftMessages.paymentSection.optionMe,
    },
  ]
}

const extraDataDocTypeLabels = {
  exemptionReason: m.extraDataMessages.documentExemptionReason,
  custodyAgreement: m.extraDataMessages.documentCustodyAgreement,
  changedCircumstances: m.extraDataMessages.documentChangedCircumstances,
} as const

type ExtraDataDocKey = keyof typeof extraDataDocTypeLabels

const extraDataOverviewItemsForDocType = (
  answers: FormValue,
  docKey: ExtraDataDocKey,
): Array<KeyValueItem> => {
  const files = getValueViaPath<Array<{ key: string; name: string }>>(
    answers,
    `extraDataAttachments.${docKey}`,
  )
  const names =
    Array.isArray(files) && files.length > 0
      ? files.map((f) => f.name).join(', ')
      : '—'
  return [
    {
      width: 'full',
      keyText: extraDataDocTypeLabels[docKey],
      valueText: names,
    },
  ]
}

const extraDataOverviewAttachmentsForDocType = (
  answers: FormValue,
  docKey: ExtraDataDocKey,
): Array<AttachmentItem> => {
  const files = getValueViaPath<Array<{ key: string; name: string }>>(
    answers,
    `extraDataAttachments.${docKey}`,
  )
  if (!Array.isArray(files)) return []
  return files.map((file) => ({
    width: 'full' as const,
    fileName: file.name,
    fileType: file.name?.split('.').pop(),
  }))
}

export const extraDataExemptionReasonOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
  _userNationalId?: string,
  _locale?: Locale,
) => extraDataOverviewItemsForDocType(answers, 'exemptionReason')

export const extraDataExemptionReasonOverviewAttachments = (
  answers: FormValue,
  _externalData: ExternalData,
) => extraDataOverviewAttachmentsForDocType(answers, 'exemptionReason')

export const extraDataCustodyAgreementOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
  _userNationalId?: string,
  _locale?: Locale,
) => extraDataOverviewItemsForDocType(answers, 'custodyAgreement')

export const extraDataCustodyAgreementOverviewAttachments = (
  answers: FormValue,
  _externalData: ExternalData,
) => extraDataOverviewAttachmentsForDocType(answers, 'custodyAgreement')

export const extraDataChangedCircumstancesOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
  _userNationalId?: string,
  _locale?: Locale,
) => extraDataOverviewItemsForDocType(answers, 'changedCircumstances')

export const extraDataChangedCircumstancesOverviewAttachments = (
  answers: FormValue,
  _externalData: ExternalData,
) => extraDataOverviewAttachmentsForDocType(answers, 'changedCircumstances')

export const assigneePersonalInfoOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
  userNationalId?: string,
  _locale?: Locale,
): Array<KeyValueItem> => {
  const prefix = userNationalId ? sanitizeKennitala(userNationalId) : ''
  return [
    {
      width: 'full',
      keyText: m.draftMessages.overviewSection.name,
      valueText:
        getValueViaPath<string>(answers, `${prefix}.assigneeInfo.name`) ?? '',
    },
    {
      width: 'half',
      keyText: m.draftMessages.overviewSection.nationalId,
      valueText: formatKennitala(
        getValueViaPath<string>(answers, `${prefix}.assigneeInfo.nationalId`) ??
          '',
      ),
    },
    {
      width: 'half',
      keyText: m.draftMessages.overviewSection.address,
      valueText:
        getValueViaPath<string>(answers, `${prefix}.assigneeInfo.address`) ??
        '',
    },
    {
      width: 'half',
      keyText: m.draftMessages.overviewSection.postalCode,
      valueText:
        getValueViaPath<string>(answers, `${prefix}.assigneeInfo.postalCode`) ??
        '',
    },
    {
      width: 'half',
      keyText: m.draftMessages.overviewSection.city,
      valueText:
        getValueViaPath<string>(answers, `${prefix}.assigneeInfo.city`) ?? '',
    },
    {
      width: 'half',
      keyText: m.draftMessages.overviewSection.email,
      valueText:
        getValueViaPath<string>(answers, `${prefix}.assigneeInfo.email`) ?? '',
    },
    {
      width: 'half',
      keyText: m.draftMessages.overviewSection.phoneNumber,
      valueText: formatPhoneNumberWithIcelandicCountryCode(
        getValueViaPath<string>(
          answers,
          `${prefix}.assigneeInfo.phoneNumber`,
        ) ?? '',
      ),
    },
  ]
}

export const assigneeAssetDeclarationOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
  userNationalId?: string,
  _locale?: Locale,
): Array<KeyValueItem> => {
  const prefix = userNationalId ? sanitizeKennitala(userNationalId) : ''
  const hasAssets =
    getValueViaPath<string>(answers, `${prefix}.assetDeclerationRadio`) === YES

  const items: Array<KeyValueItem> = [
    {
      width: 'full',
      keyText: m.assigneeDraftOverview.ownsAssets,
      valueText: hasAssets
        ? m.assigneeDraftOverview.yes
        : m.assigneeDraftOverview.no,
    },
  ]

  if (hasAssets) {
    const description =
      getValueViaPath<string>(
        answers,
        `${prefix}.assetDeclerationTextField`,
      )?.trim() ?? ''
    if (description) {
      items.push({
        width: 'full',
        keyText: m.assigneeDraftOverview.assetDescription,
        valueText: description,
      })
    }
  }

  return items
}

export const assigneeAddressMatchOverviewItems = (
  answers: FormValue,
  externalData: ExternalData,
  userNationalId: string,
  _locale?: Locale,
): Array<KeyValueItem> => {
  const matches = doesAssigneeAddressMatchRentalContract(
    answers,
    externalData,
    userNationalId,
  )

  return [
    {
      width: 'full',
      keyText: m.assigneeDraftOverview.addressMatchStatus,
      valueText: matches
        ? m.assigneeDraftOverview.addressMatchConfirmed
        : m.assigneeDraftOverview.no,
    },
  ]
}
