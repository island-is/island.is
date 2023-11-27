import { Answer, NO, YES } from '@island.is/application/types'
import { shared } from './lib/messages'
import {
  ComplainedForTypes,
  ComplaineeTypes,
  OmbudsmanComplaintTypeEnum,
} from './shared/constants'
import { complainedFor } from './lib/messages'

export const isGovernmentComplainee = (answers: Answer) => {
  return (
    (answers as { complainee: { type: ComplaineeTypes } }).complainee?.type ===
    ComplaineeTypes.GOVERNMENT
  )
}

export const getComplaintType = (answers: Answer) => {
  return (
    answers as {
      complaintType: OmbudsmanComplaintTypeEnum
    }
  )?.complaintType
}

const getDateAYearBack = () => {
  const d = new Date()
  const aYearAgo = d.getFullYear() - 1
  d.setFullYear(aYearAgo)
  return d
}

export const isDecisionDateOlderThanYear = (answers: Answer) => {
  // Checks if date exists and if it's older than a year
  const aYearBack = getDateAYearBack()
  const date = (
    answers as {
      complaintDescription: { decisionDate: string }
    }
  ).complaintDescription?.decisionDate

  return !!date && new Date(date).getTime() < aYearBack.getTime()
}

export const yesNoMessageMapper = {
  [YES]: shared.general.yes,
  [NO]: shared.general.no,
}

export const mapComplainedForToMessage = {
  [ComplainedForTypes.MYSELF]: complainedFor.decision.myselfLabel,
  [ComplainedForTypes.SOMEONEELSE]: complainedFor.decision.someoneelseLabel,
}
