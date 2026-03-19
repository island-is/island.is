import { getValueViaPath } from '@island.is/application/core'
import {
  Application,
  AttachmentItem,
  ExternalData,
  FormValue,
  KeyValueItem,
} from '@island.is/application/types'
import { Locale } from '@island.is/shared/types'
import { format as formatKennitala } from 'kennitala'
import {
  formatBankInfo,
  formatPhoneNumberWithIcelandicCountryCode,
} from '@island.is/application/ui-components'
import * as m from '../lib/messages'
import {
  getHouseholdMembersForTable,
  getSelectedContract,
  getSelectedLandlordForPayment,
} from './rentalAgreementUtils'

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

  const reasonLabels: Record<string, (typeof m.draftMessages.exemptionSection)['checkboxLabelStudies']> = {
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

  return members.flatMap((member, index) => {
    const answerRow = answerByNationalId.get(normalizeId(member.nationalId))
    const displayName = answerRow?.name || member.name
    const displayNationalId = answerRow?.nationalId || member.nationalId
    const items: Array<KeyValueItem> = [
      {
        width: 'half',
        keyText: {
          ...m.draftMessages.overviewSection.nameIndex,
          values: { index: index + 1 },
        },
        valueText: displayName,
      },
      {
        width: 'half',
        keyText: m.draftMessages.overviewSection.nationalId,
        valueText: displayNationalId
          ? formatKennitala(displayNationalId)
          : '',
      },
    ]
    if (
      answerRow?.file &&
      Array.isArray(answerRow.file) &&
      answerRow.file.length > 0
    ) {
      items.push({
        width: 'full',
        keyText: m.draftMessages.householdMembersSection
          .custodyAgreementUploadTitle,
        valueText: answerRow.file.map((f) => f.name).join(', '),
      })
    }
    return items
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

const formatBankAccount = (
  bankAccount: { bankNumber?: string; ledger?: string; accountNumber?: string } | undefined,
): string => {
  if (!bankAccount) return ''
  const combined =
    (bankAccount.bankNumber ?? '') +
    (bankAccount.ledger ?? '') +
    (bankAccount.accountNumber ?? '')
  return combined.length === 12 ? formatBankInfo(combined) : combined
}

export const paymentSectionOverviewItems = (
  answers: FormValue,
  externalData: ExternalData,
  _userNationalId?: string,
  _locale?: Locale,
): Array<KeyValueItem> => {
  const paymentRadio = getValueViaPath<string>(answers, 'paymentRadio')
  const isLandlord = paymentRadio === 'landlord'

  const bankAccount = isLandlord
    ? getValueViaPath<{ bankNumber?: string; ledger?: string; accountNumber?: string }>(
        answers,
        'payment.landlordBankAccount',
      )
    : getValueViaPath<{ bankNumber?: string; ledger?: string; accountNumber?: string }>(
        answers,
        'payment.bankAccount',
      )

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
          valueText: formatBankAccount(bankAccount),
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
        valueText: formatBankAccount(bankAccount),
      },
    ]
  }

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
      keyText: m.draftMessages.paymentSection.bankAccountTitle,
      valueText: formatBankAccount(bankAccount),
    },
  ]
}
