import {
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  YES,
} from '@island.is/application/core'
import * as m from '../../lib/messages'

export const confirmReadSection = buildSection({
  id: 'confirmReadSection',
  title: m.prereqMessages.confirmReadSectionTitle,
  children: [
    buildMultiField({
      id: 'confirmRead',
      title: m.prereqMessages.confirmReadTitle,
      children: [
        buildDescriptionField({
          id: 'confirmReadDescription',
          description: m.prereqMessages.confirmRead,
          marginBottom: 4,
        }),
        buildCheckboxField({
          id: 'confirmRead.privacyPolicy',
          options: [
            {
              label: m.prereqMessages.confirmReadPrivacyPolicy,
              value: YES,
            },
          ],
        }),
        buildCheckboxField({
          id: 'confirmRead.housingBenefitsInfo',
          options: [
            {
              label: m.prereqMessages.confirmReadHousingBenefitsInfo,
              value: YES,
            },
          ],
        }),
      ],
    }),
  ],
})
