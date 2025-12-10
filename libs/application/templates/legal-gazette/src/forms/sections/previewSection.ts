import {
  buildSection,
  buildMultiField,
  buildDescriptionField,
  buildCustomField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const previewSection = buildSection({
  id: 'preview',
  title: m.draft.sections.preview.sectionTitle,
  children: [
    buildMultiField({
      id: 'preview.form',
      title: m.draft.sections.preview.formTitle,
      children: [
        buildDescriptionField({
          id: 'preview.formIntro',
          description: m.draft.sections.preview.formIntro,
          marginBottom: [3, 4, 5],
        }),
        buildCustomField({
          id: 'preview.advertPreview',
          component: 'AdvertPreview',
        }),
      ],
    }),
  ],
})
