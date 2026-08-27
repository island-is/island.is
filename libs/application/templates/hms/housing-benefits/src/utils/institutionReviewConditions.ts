import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

export const isInstitutionApproved = (answers: FormValue) =>
  getValueViaPath<string>(answers, 'approveOrReject') === 'approve'

export const isInstitutionRejected = (answers: FormValue) =>
  getValueViaPath<string>(answers, 'approveOrReject') === 'reject'

export const isInstitutionRequestingExtraData = (answers: FormValue) =>
  getValueViaPath<string>(answers, 'approveOrReject') === 'requestExtraData'
