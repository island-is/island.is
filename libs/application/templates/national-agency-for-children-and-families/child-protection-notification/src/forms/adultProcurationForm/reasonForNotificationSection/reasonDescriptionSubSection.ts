import {
  buildCheckboxField,
  buildMultiField,
  buildSubSection,
  buildTextField,
  YES,
} from '@island.is/application/core'
import { reasonForNotificationMessages } from '../../../lib/messages'

export const reasonDescriptionSubSection = buildSubSection({
  id: 'reasonDescriptionSubSection',
  title: reasonForNotificationMessages.description.subSectionTitle,
  children: [
    buildMultiField({
      id: 'reasonDescription',
      title: reasonForNotificationMessages.description.title,
      description: reasonForNotificationMessages.description.description,
      children: [
        buildTextField({
          id: 'reasonDescription.description',
          placeholder: reasonForNotificationMessages.description.placeholder,
          variant: 'textarea',
          rows: 20,
        }),
        buildCheckboxField({
          id: 'reasonDescription.additionalData',
          title: reasonForNotificationMessages.description.additionalDataTitle,
          marginTop: 4,
          options: [
            {
              value: YES,
              label:
                reasonForNotificationMessages.description
                  .additionalDataCheckbox,
            },
          ],
        }),
      ],
    }),
  ],
})
