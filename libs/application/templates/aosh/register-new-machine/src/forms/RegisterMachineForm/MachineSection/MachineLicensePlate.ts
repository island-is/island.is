import {
  NO,
  YES,
  buildAlertMessageField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { information, licensePlate, overview } from '../../../lib/messages'
import { plate110 } from '../../../assets/plates/plate-110-510'
import { plate200 } from '../../../assets/plates/plate-200-280'
import { plate155 } from '../../../assets/plates/plate-155-305'
import { Plate } from '../../../shared/types'
import { canMaybeRegisterToTraffic, canRegisterToTraffic } from '../../../utils'

export const MachineLicensePlate = buildSubSection({
  id: 'streetRegistrationSection',
  title: licensePlate.general.title,
  condition: (answers) => canRegisterToTraffic(answers),
  children: [
    buildMultiField({
      id: 'streetRegistration',
      title: licensePlate.general.title,
      description: licensePlate.general.description,
      children: [
        buildRadioField({
          id: 'machine.streetRegistration.registerToTraffic',
          title: licensePlate.general.subTitle,
          width: 'half',
          defaultValue: NO,
          options: [
            {
              value: NO,
              label: information.labels.radioButtons.radioOptionNo,
            },
            {
              value: YES,
              label: information.labels.radioButtons.radioOptionYes,
            },
          ],
        }),
        buildRadioField({
          id: 'machine.streetRegistration.size',
          backgroundColor: 'white',
          options: [
            {
              value: Plate.A,
              label: licensePlate.labels.plate110,
              illustration: plate110,
            },
            {
              value: Plate.B,
              label: licensePlate.labels.plate200,
              illustration: plate200,
            },
            {
              value: Plate.D,
              label: licensePlate.labels.plate155,
              illustration: plate155,
            },
          ],
          defaultValue: Plate.A,
          widthWithIllustration: '1/3',
          hasIllustration: true,
          condition: (answers) => {
            const registerToTraffic = getValueViaPath(
              answers,
              'machine.streetRegistration.registerToTraffic',
              NO,
            ) as typeof NO | typeof YES

            return registerToTraffic === YES
          },
        }),
        buildAlertMessageField({
          id: 'streetRegistration.alertMessage',
          title: overview.labels.alertMessageTitle,
          message: overview.labels.alertMessageMessage,
          alertType: 'warning',
          condition: (answers) => canMaybeRegisterToTraffic(answers),
        }),
      ],
    }),
  ],
})
