import { ApplicationContext } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { IS_REGULATED_EXTERNAL_DATA_ID } from './constants'

// Guards the prerequisites -> draft transition on the backend. Only a company
// that Fjarskiptastofa reports as a supervised entity with an open access window
// may start the assessment. The isRegulated data provider stores both flags on
// entry to the prerequisites state; an ineligible company cannot transition even
// if the frontend submit check is bypassed.
export const canStartApplication = (context: ApplicationContext): boolean => {
  const { application } = context

  const isSupervisedEntity = getValueViaPath<boolean>(
    application.externalData,
    `${IS_REGULATED_EXTERNAL_DATA_ID}.data.isSupervisedEntity`,
  )
  const accessWindowOpen = getValueViaPath<boolean>(
    application.externalData,
    `${IS_REGULATED_EXTERNAL_DATA_ID}.data.accessWindowOpen`,
  )

  return isSupervisedEntity === true && accessWindowOpen === true
}
