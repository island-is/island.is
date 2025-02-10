import { getValueViaPath, NO, YES } from '@island.is/application/core'
import { FormatMessage, FormValue } from '@island.is/application/types'
import { information, licensePlate } from '../lib/messages'

export const getStreetRegistrationInformation = (
  answers: FormValue,
  formatMessage: FormatMessage,
) => {
  const registerToTraffic = getValueViaPath(
    answers,
    'machine.streetRegistration.registerToTraffic',
  ) as typeof NO | typeof YES

  const licensePlateSize = getValueViaPath(
    answers,
    'machine.streetRegistration.size',
  ) as '1' | '2' | '3'

  return registerToTraffic === YES
    ? [
        `${formatMessage(
          licensePlate.labels.streetRegistration,
        )}: ${formatMessage(information.labels.radioButtons.radioOptionYes)}`,
        `${formatMessage(licensePlate.labels.plateSize)}: ${
          licensePlateSize === '1'
            ? formatMessage(licensePlate.labels.plate110)
            : licensePlateSize === '2'
            ? formatMessage(licensePlate.labels.plate200)
            : formatMessage(licensePlate.labels.plate155)
        }`,
      ]
    : [
        `${formatMessage(
          licensePlate.labels.streetRegistration,
        )}: ${formatMessage(information.labels.radioButtons.radioOptionNo)}`,
      ]
}
