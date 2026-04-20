import { getValueViaPath } from '@island.is/application/core'
import { confirmation } from '../lib/messages'
import { Application } from '@island.is/application/types'

export const getConclusionAlertTitle = (application: Application) => {
  const plate = getValueViaPath(
    application.answers,
    'pickVehicle.plate',
    undefined,
  ) as string | undefined
  return { ...confirmation.alertTitle, values: { value: plate } }
}
