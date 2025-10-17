import {
  buildSection,
  buildMultiField,
  buildCheckboxField,
  buildDescriptionField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { YES } from '../../lib/constants'

export const reminderInfoForAssetsAndDebts = buildSection({
  id: 'reminderInfo',
  title: m.reminderInfoTitle,
  children: [
    buildMultiField({
      id: 'reminder',
      title: m.reminderInfoTitle,
      description: m.reminderInfoDescription,
      children: [
        buildDescriptionField({
          id: 'reminderInfo.description',
          title: m.reminderInfoAssetsAndDebts,
          titleVariant: 'h3',
          marginBottom: 'gutter',
          description: m.reminderInfoAssetsAndDebtsDescription,
        }),
        buildCheckboxField({
          id: 'reminderInfo.assetsAndDebtsCheckbox',
          options: [
            {
              value: YES,
              label: m.reminderInfoAssetsAndDebtsCheckbox,
            },
          ],
          backgroundColor: 'blue',
          width: 'full',
        }),
        buildDescriptionField({
          id: 'reminderInfo.description2',
          title: m.reminderInfoAttachments,
          titleVariant: 'h3',
          space: 'containerGutter',
          marginBottom: 'gutter',
          description: m.reminderInfoAttachmentsDescription,
        }),
        buildCheckboxField({
          id: 'reminderInfo.attachmentsCheckbox',
          options: [
            {
              value: YES,
              label: m.reminderInfoAttachmentsCheckbox,
            },
          ],
          backgroundColor: 'blue',
          width: 'full',
        }),
      ],
    }),
  ],
})
