import { getValueViaPath } from '@island.is/application/core'
import {
  ExternalData,
  FormValue,
  TableData,
} from '@island.is/application/types'
import { Participant } from '../shared/types'
import { participants } from '../lib/messages'
import { formatPhoneNumber } from './formatPhoneNumber'

export const getOverviewTable = (
  answers: FormValue,
  _externalData: ExternalData,
): TableData => {
  const data = getValueViaPath<Participant[]>(answers, 'participantList') ?? []
  return {
    header: [
      participants.labels.name,
      participants.labels.nationalId,
      participants.labels.email,
      participants.labels.phoneNumber,
    ],
    rows: data.map((participant) => {
      return [
        participant.nationalIdWithName.name,
        participant.nationalIdWithName.nationalId,
        participant.email,
        formatPhoneNumber(participant.phoneNumber),
      ]
    }),
  }
}
