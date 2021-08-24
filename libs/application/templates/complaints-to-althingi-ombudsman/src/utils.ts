import { Answer } from '@island.is/application/core'
import { shared } from './lib/messages'
import {
  ComplainedForTypes,
  ComplaineeTypes,
  NO,
  OmbudsmanComplaintTypeEnum,
  YES,
} from './shared/constants'
import { complainedFor } from './lib/messages'

export const isGovernmentComplainee = (answers: Answer) => {
  return (
    (answers as { complainee: { type: ComplaineeTypes } }).complainee?.type ===
    ComplaineeTypes.GOVERNMENT
  )
}

export const getComplaintType = (answers: Answer) => {
  return (answers as {
    complaintType: OmbudsmanComplaintTypeEnum
  })?.complaintType
}

export const getDateAYearBack = () => {
  const d = new Date()
  const aYearAgo = d.getFullYear() - 1
  d.setFullYear(aYearAgo)
  return d
}

export const yesNoMessageMapper = {
  [YES]: shared.general.yes,
  [NO]: shared.general.no,
}

export const mapComplainedForToMessage = {
  [ComplainedForTypes.MYSELF]: complainedFor.decision.myselfLabel,
  [ComplainedForTypes.SOMEONEELSE]: complainedFor.decision.someoneelseLabel,
}
