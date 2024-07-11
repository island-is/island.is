import {
  NO,
  YES,
  buildCustomField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { information, licensePlate } from '../../../lib/messages'
import { plate110 } from '../../../assets/plates/plate-110-510'
import { plate200 } from '../../../assets/plates/plate-200-280'
import { plate155 } from '../../../assets/plates/plate-155-305'
import { Plate } from '../../../shared/types'

export const MachineLicensePlate = buildSubSection({
  id: 'licencePlate',
  title: licensePlate.general.title,
  children: [
    buildMultiField({
      id: 'licencePlate',
      title: licensePlate.general.title,
      description: licensePlate.general.description,
      children: [
        buildRadioField({
          id: 'licencePlate.registerToTraffic',
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
        // buildCustomField({
        //   id: 'licencePlate',
        //   title: '',
        //   component: 'LicensePlates',
        // }),
        buildRadioField({
          id: 'licencePlate.size',
          title: '',
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
          width: 'half',
          condition: (answers) => {
            const registerToTraffic = getValueViaPath(
              answers,
              'licencePlate.registerToTraffic',
              NO,
            ) as typeof NO | typeof YES

            return registerToTraffic === YES
          },
        }),
      ],
    }),
  ],
})
