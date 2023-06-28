import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
} from '@island.is/application/core'
import { ApplicationReasons } from '../../lib/constants'
import { m } from '../../lib/messages'

export const sectionReasonForApplication = buildSection({
  id: 'fakeData',
  title: m.reasonSectionTitle,
  children: [
    buildMultiField({
      id: 'reason',
      title: m.reasonTitle,
      children: [
        buildDescriptionField({
          id: 'reasonDescription',
          title: '',
          description: m.reasonDescription,
        }),
        buildRadioField({
          id: 'reason.reasonGiven',
          title: '',
          width: 'half',
          space: 'smallGutter',
          options: [
            {
              label: m.reasonLostOption,
              value: ApplicationReasons.LOST,
            },
            {
              label: m.reasonStolenOption,
              value: ApplicationReasons.STOLEN,
            },
          ],
        }),
      ],
    }),
  ],
})
