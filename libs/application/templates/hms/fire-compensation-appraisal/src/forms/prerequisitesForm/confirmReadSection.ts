import {
  buildCheckboxField,
  buildMultiField,
  buildSection,
  buildTitleField,
  YES,
} from '@island.is/application/core'
import * as m from '../../lib/messages'

export const confirmReadSection = buildSection({
  id: 'confirmReadSectionSection',
  tabTitle: m.confirmReadMessages.title,
  children: [
    buildMultiField({
      id: 'confirmRead',
      title: m.confirmReadMessages.title,
      description: m.confirmReadMessages.description,
      children: [
        buildCheckboxField({
          id: 'confirmReadPrivacyPolicy',
          options: [
            {
              label: m.confirmReadMessages.confirmReadPrivacyPolicy,
              value: YES,
            },
          ],
        }),
        buildCheckboxField({
          id: 'confirmReadFireCompensationInfo',
          options: [
            {
              label: m.confirmReadMessages.confirmReadFireCompensationInfo,
              value: YES,
            },
          ],
        }),
        buildTitleField({
          title: 'Aðrar eignir.',
        }),
        buildCheckboxField({
          id: 'otherPropertiesThanIOwnCheckbox',
          options: [
            { 
              label: 'Ég er að sækja um eign sem ég á ekki.',
              value: YES,
            },
          ],
        }),
      ],
    }),
  ],
})
