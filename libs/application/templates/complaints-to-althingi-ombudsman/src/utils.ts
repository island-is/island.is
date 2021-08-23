import { Answer } from '@island.is/application/core'
import { courtAction } from './lib/messages'
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

const getDateAYearBack = () => {
  const d = new Date()
  const aYearAgo = d.getFullYear() - 1
  d.setFullYear(aYearAgo)
  return d
}

export const isDecisionDateOlderThanYear = (answers: Answer) => {
  const aYearBack = getDateAYearBack()
  const date = (answers as {
    complaintDescription: { decisionDate: string }
  }).complaintDescription?.decisionDate

  return !!date && new Date(date).getTime() < aYearBack.getTime()
}

export const yesNoMessageMapper = {
  [YES]: courtAction.yes,
  [NO]: courtAction.no,
}

export const mapComplainedForToMessage = {
  [ComplainedForTypes.MYSELF]: complainedFor.decision.myselfLabel,
  [ComplainedForTypes.SOMEONEELSE]: complainedFor.decision.someoneelseLabel,
}
