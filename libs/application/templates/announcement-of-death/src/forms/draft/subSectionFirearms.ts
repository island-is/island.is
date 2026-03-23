import {
  buildCustomField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  NO,
  YES,
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
          defaultValue: NO,
          options: [
            {
              value: NO,
              label: m.firearmsNo,
            },
            {
              value: YES,
              label: m.firearmsYes,
            },
          ],
        }),
        buildCustomField({
          id: 'firearmApplicant',
          component: 'FirearmApplicant',
          condition: (formValue) => formValue.hadFirearms === YES,
        }),
        buildCustomField({
          id: 'firearmsWrapper',
          component: 'FirearmsWrapper',
        }),
      ],
    }),
  ],
})
