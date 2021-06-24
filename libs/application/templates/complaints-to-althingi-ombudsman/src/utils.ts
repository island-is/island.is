import { Answer } from '@island.is/application/core'
import { ComplaineeTypes, OmbudsmanComplaintTypeEnum } from './shared/constants'

export const isGovernmentComplainee = (answers: Answer) => {
  return (
    (answers as { complainee: { type: ComplaineeTypes } }).complainee?.type ===
    ComplaineeTypes.GOVERNMENT
  )
}

export const getComplaintType = (answers: Answer) => {
  return (answers as {
    complaintInformation: { complaintType: OmbudsmanComplaintTypeEnum }
  }).complaintInformation?.complaintType
}

export const getDateAYearBack = () => {
  const d = new Date()
  const aYearAgo = d.getFullYear() - 1
  d.setFullYear(aYearAgo)
  return d
}
