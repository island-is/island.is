import {
  buildMultiField,
  buildSubSection,
  buildRadioField,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import { idInformation } from '../../../lib/messages/idInformation'

export const TypeOfIdSubSection = buildSubSection({
  id: Routes.TYPEOFID,
  title: idInformation.general.typeofIdSectionTitle,
  children: [
    buildMultiField({
      id: `${Routes.TYPEOFID}multiField`,
      title: idInformation.labels.typeOfIdTitle,
      description: idInformation.labels.typeOfIdDescription,
      children: [
        buildRadioField({
          id: Routes.TYPEOFID,
          title: idInformation.labels.typeOfIdRadioLabel,
          width: 'half',
          required: true,
          options: [
            {
              label: idInformation.labels.typeOfIdRadioAnswerOne,
              value: 'WithTravel',
            },
            {
              label: idInformation.labels.typeOfIdRadioAnswerTwo,
              value: 'WithoutTravel',
            },
          ],
        }),
      ],
    }),
  ],
})
