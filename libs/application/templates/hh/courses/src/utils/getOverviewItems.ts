import { z } from 'zod'

import type {
  ExternalData,
  KeyValueItem,
  FormValue,
  TableData,
} from '@island.is/application/types'
import { getValueViaPath, YesOrNoEnum } from '@island.is/application/core'

import { m } from '../lib/messages'
import { formatPhoneNumber } from './formatPhoneNumber'
import { dataSchema } from '../lib/dataSchema'

export const getParticipantOverviewTableData = (
  answers: FormValue,
  _externalData: ExternalData,
): TableData => {
  const participantList =
    getValueViaPath<z.infer<typeof dataSchema.shape.participantList>>(
      answers,
      'participantList',
    ) ?? []

  const hasWorkplaceOrJobTitle = participantList.some(
    (p) => p.workplace || p.jobTitle,
  )

  const header = [
    m.overview.participantName,
    m.overview.participantNationalId,
    m.overview.participantEmail,
    m.overview.participantPhone,
    ...(hasWorkplaceOrJobTitle
      ? [m.overview.workplace, m.overview.jobTitle]
      : []),
  ]

  const rows = participantList.map((participant) => [
    participant.nationalIdWithName.name,
    participant.nationalIdWithName.nationalId,
    participant.nationalIdWithName.email,
    formatPhoneNumber(participant.nationalIdWithName.phone),
    ...(hasWorkplaceOrJobTitle
      ? [participant.workplace ?? '', participant.jobTitle ?? '']
      : []),
  ])

  return { header, rows }
}

export const getPayerOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const userIsPayingAsIndividual = getValueViaPath<YesOrNoEnum>(
    answers,
    'payment.userIsPayingAsIndividual',
    YesOrNoEnum.YES,
  )

  const items: Array<KeyValueItem> = [
    {
      width: 'full',
      keyText: m.payer.userIsPayingAsIndividualLabel,
      valueText:
        userIsPayingAsIndividual === YesOrNoEnum.YES
          ? m.payer.userIsPayingAsIndividualYesLabel
          : m.payer.userIsPayingAsIndividualNoLabel,
    },
  ]

  if (userIsPayingAsIndividual === YesOrNoEnum.NO) {
    items.push({
      width: 'full',
      keyText: m.overview.payerName,
      valueText:
        getValueViaPath<string>(answers, 'payment.companyPayment.name') ?? '',
    })
    items.push({
      width: 'full',
      keyText: m.overview.payerNationalId,
      valueText:
        getValueViaPath<string>(answers, 'payment.companyPayment.nationalId') ??
        '',
    })
  }

  return items
}
