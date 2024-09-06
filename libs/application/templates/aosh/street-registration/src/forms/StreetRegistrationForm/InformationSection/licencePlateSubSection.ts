import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
} from '@island.is/application/core'
import { licencePlate } from '../../../lib/messages'
import { plate110 } from '../../../assets/plates/plate-110-510'
import { plate200 } from '../../../assets/plates/plate-200-280'
import { plate155 } from '../../../assets/plates/plate-155-305'
import { Plate } from '../../../shared'

export const licencePlateSubSection = buildSubSection({
  id: 'licencePlateSubSection',
  title: licencePlate.general.title,
  children: [
    buildMultiField({
      id: 'licencePlate',
      title: licencePlate.general.title,
      description: licencePlate.general.description,
      children: [
        buildRadioField({
          id: 'licencePlate.size',
          title: licencePlate.general.subTitle,
          description: licencePlate.general.subTitleDescription,
          backgroundColor: 'white',
          options: [
            {
              value: Plate.A,
              label: licencePlate.labels.plate110,
              illustration: plate110,
            },
            {
              value: Plate.B,
              label: licencePlate.labels.plate200,
              illustration: plate200,
            },
            {
              value: Plate.D,
              label: licencePlate.labels.plate155,
              illustration: plate155,
            },
          ],
          defaultValue: Plate.A,
          largeButtons: true,
          width: 'full',
        }),
      ],
    }),
  ],
})
