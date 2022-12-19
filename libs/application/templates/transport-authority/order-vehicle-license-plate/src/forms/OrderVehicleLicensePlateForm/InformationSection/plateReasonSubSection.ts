import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
  buildRadioField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'

export const plateReasonSubSection = buildSubSection({
  id: 'plateReason',
  title: information.labels.plateReason.sectionTitle,
  children: [
    buildMultiField({
      id: 'plateReasonMultiField',
      title: information.labels.plateReason.title,
      description: information.general.description,
      children: [
        buildDescriptionField({
          id: 'plateReason.reason.subTitle',
          title: information.labels.plateReason.subTitle,
          titleVariant: 'h5',
          space: 3,
        }),
        buildRadioField({
          title: '',
          id: 'plateReason.reason',
          options: [
            {
              value: 'new',
              label: information.labels.plateReason.newOptionTitle,
              subLabel:
                information.labels.plateReason.newOptionSubTitle.defaultMessage,
            },
            {
              value: 'lost',
              label: information.labels.plateReason.lostOptionTitle,
              subLabel:
                information.labels.plateReason.lostOptionSubTitle
                  .defaultMessage,
            },
          ],
          width: 'half',
          largeButtons: true,
        }),
      ],
    }),
  ],
})
