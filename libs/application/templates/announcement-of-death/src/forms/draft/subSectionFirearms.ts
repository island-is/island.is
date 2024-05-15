import {
  buildCustomField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const subSectionFirearms = buildSubSection({
  id: 'firearmsStep',
  title: m.firearmsTitle,
  children: [
    buildMultiField({
      id: 'firearmsTitle',
      title: m.firearmsTitle,
      description: m.firearmsDescription,
      children: [
        buildRadioField({
          id: 'hadFirearms',
          title: m.firearmsHadFirearms,
          width: 'full',
          largeButtons: false,
          defaultValue: 'no',
          options: [
            {
              value: 'yes',
              label: m.firearmsYes,
            },
            {
              value: 'no',
              label: m.firearmsNo,
            },
          ],
        }),
        buildCustomField({
          title: '',
          id: 'firearmApplicant',
          description: m.firearmsApplicantTitle,
          component: 'FirearmApplicant',
          condition: (formValue) => formValue.hadFirearms === 'yes',
        }),
      ],
    }),
  ],
})
