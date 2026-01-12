import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

export const isApproved = (answers: FormValue) =>
  getValueViaPath<string>(answers, 'approveOrReject') === 'approve'

export const isRejected = (answers: FormValue) =>
  getValueViaPath<string>(answers, 'approveOrReject') === 'reject'
