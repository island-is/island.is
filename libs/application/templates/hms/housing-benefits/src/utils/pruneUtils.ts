import addDays from 'date-fns/addDays'
import { getValueViaPath } from '@island.is/application/core'
import { Application, FormValue } from '@island.is/application/types'

export const DRAFT_PRUNE_DAYS = 45

export const DRAFT_ENTERED_AT_KEY = 'draftEnteredAt'

type PruneDateApplication = {
  answers: FormValue
}

export const getHousingBenefitsPruneDate = (
  application: PruneDateApplication,
): Date => {
  const draftEnteredAt = getValueViaPath<string>(
    application.answers,
    DRAFT_ENTERED_AT_KEY,
  )

  if (draftEnteredAt) {
    return addDays(new Date(draftEnteredAt), DRAFT_PRUNE_DAYS)
  }

  return addDays(new Date(), DRAFT_PRUNE_DAYS)
}
