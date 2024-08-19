import { getValueViaPath } from '@island.is/application/core'
import { FormatMessage, FormValue, NO, YES } from '@island.is/application/types'
import { information, licensePlate } from '../lib/messages'

export const getStreetRegistrationInformation = (
  answers: FormValue,
  formatMessage: FormatMessage,
) => {
  const registerToTraffic = getValueViaPath(
    answers,
    'streetRegistration.registerToTraffic',
  ) as typeof NO | typeof YES

  const licensePlateSize = getValueViaPath(
    answers,
    'streetRegistration.size',
  ) as 'A' | 'B' | 'D'

  return registerToTraffic === YES
    ? [
        `${formatMessage(
          licensePlate.labels.streetRegistration,
        )}: ${formatMessage(information.labels.radioButtons.radioOptionYes)}`,
        `${formatMessage(licensePlate.labels.plateSize)}: ${
          licensePlateSize === 'A'
            ? formatMessage(licensePlate.labels.plate110)
            : licensePlateSize === 'B'
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
