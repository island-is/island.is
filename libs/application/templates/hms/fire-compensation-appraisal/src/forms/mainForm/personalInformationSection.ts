import {
  buildMultiField,
  buildRadioField,
  buildSection,
} from '@island.is/application/core'
import { applicantInformationArray } from '@island.is/application/ui-forms'
import * as m from '../../lib/messages'

export const personalInformationSection = buildSection({
  id: 'personalInformationSection',
  title: m.personalInformationMessages.title,
  children: [
    buildMultiField({
      id: 'personalInformation',
      title: m.personalInformationMessages.title,
      children: [
        ...applicantInformationArray(),
        buildRadioField({
          id: 'isOwner',
          marginTop: 2,
          options: [
            {
              value: 'yes',
              label: m.personalInformationMessages.isOwner,
            },
            {
              value: 'no',
              label: m.personalInformationMessages.isNotOwner,
            },
          ],
        }),
      ],
    }),
  ],
})
