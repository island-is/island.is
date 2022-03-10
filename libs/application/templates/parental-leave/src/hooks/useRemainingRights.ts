import { useMemo } from 'react'

import { Application } from '@island.is/application/core'

import { getAvailableRightsInDays } from '../lib/parentalLeaveUtils'
import { useDaysAlreadyUsed } from './useDaysAlreadyUsed'

export const useRemainingRights = (application: Application) => {
  const rights = getAvailableRightsInDays(application)
  const daysUsed = useDaysAlreadyUsed(application)

  return useMemo(() => rights - daysUsed, [rights, daysUsed])
}
