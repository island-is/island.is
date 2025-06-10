import { Answer } from '@island.is/application/types'
import { information, shared } from './lib/messages'
import {
  ComplainedForTypes,
  ComplaineeTypes,
  GenderAnswerOptions,
  OmbudsmanComplaintTypeEnum,
} from './shared/constants'
import { complainedFor } from './lib/messages'
import format from 'date-fns/format'
import { NO, YES, YesOrNo } from '@island.is/application/core'

export const isGovernmentComplainee = (answers: Answer) => {
  return (
    (answers as { complainee: { type: ComplaineeTypes } }).complainee?.type ===
    ComplaineeTypes.GOVERNMENT
  )
}

export const isPreviousOmbudsmanComplaint = (answers: Answer) => {
  return (
    (answers as { previousOmbudsmanComplaint: { Answer: YesOrNo } })
      .previousOmbudsmanComplaint?.Answer === YES
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

export const formatDate = (date: Date): string =>
  date ? format(new Date(date), 'dd.MM.yyyy') : ''

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

export const genderOptions = [
  {
    label: information.aboutTheComplainer.genderOptionFemale,
    value: GenderAnswerOptions.FEMALE,
  },
  {
    label: information.aboutTheComplainer.genderOptionMale,
    value: GenderAnswerOptions.MALE,
  },
  {
    label: information.aboutTheComplainer.genderOptionNonbinary,
    value: GenderAnswerOptions.NONBINARY,
  },
  {
    label: information.aboutTheComplainer.genderOptionOther,
    value: GenderAnswerOptions.OTHER,
  },
  {
    label: information.aboutTheComplainer.genderOptionDeclinedToAnswer,
    value: GenderAnswerOptions.DECLINED,
  },
]
