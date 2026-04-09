import {
  buildCheckboxField,
  buildDescriptionField,
  buildHiddenInput,
  buildMultiField,
  buildSection,
  buildImageField,
} from '@island.is/application/core'
import { HandShake } from '@island.is/application/assets/graphics'
import * as m from '../../../lib/messages'
import { shouldShowRefetchNationalRegistrySection } from '../../../utils/conditions'

export const wrongHomeSection = buildSection({
  id: 'wrongHomeSection',
  title: m.assigneeDraft.wrongHomeTitle,
  children: [
    buildMultiField({
      id: 'wrongHome',
      title: m.assigneeDraft.wrongHomeMultiFieldTitle,
      description: m.assigneeDraft.wrongHomeDescription,
      children: [
        buildDescriptionField({
          id: 'wrongHome.reason2',
          description: m.assigneeDraft.wrongHomeDescription2,
          marginBottom: 4,
        }),
        buildDescriptionField({
          id: 'wrongHome.reason3',
          description: m.assigneeDraft.wrongHomeDescription3,
          marginBottom: 6,
        }),
        buildImageField({
          id: 'wrongHome.image',
          image: HandShake,
        }),
        buildCheckboxField({
          id: 'wrongHome.addressUpdated',
          title: '',
          options: [
            {
              value: 'confirmed',
              label: m.assigneeDraft.wrongHomeCheckboxLabel,
            },
          ],
        }),
        buildHiddenInput({
          id: 'wrongHome.shouldRefetchNationalRegistry',
          condition: shouldShowRefetchNationalRegistrySection,
          defaultValue: 'true',
        }),
      ],
    }),
  ],
})
