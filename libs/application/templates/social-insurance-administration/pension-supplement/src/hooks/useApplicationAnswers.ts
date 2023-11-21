import { Application } from '@island.is/application/types'

import { getApplicationAnswers } from '../lib/pensionSupplementUtils'

export const useApplicationAnswers = (application: Application) => {
  return getApplicationAnswers(application.answers)
}

export type ApplicationAnswers = ReturnType<typeof useApplicationAnswers>
