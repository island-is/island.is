import {
  buildSection,
  buildMultiField,
  buildDescriptionField,
  buildSelectField,
  getValueViaPath,
  buildTextField,
  buildCustomField,
  buildDateField,
} from '@island.is/application/core'
import format from 'date-fns/format'
import { m } from '../../lib/messages'
import { LGBaseEntity } from '../../utils/types'

export const draftSection = buildSection({
  id: 'draft.section',
  title: m.draft.sections.advert.sectionTitle,
  children: [
    buildMultiField({
      title: m.draft.sections.advert.formTitle,
      children: [
        buildDescriptionField({
          id: 'draft.description',
          description: m.draft.sections.advert.formIntro,
          marginBottom: [2, 3, 4],
        }),
        buildSelectField({
          id: 'application.categoryId',
          title: m.draft.sections.advert.categoryInput,
          options: ({ externalData }) => {
            const categories = getValueViaPath<LGBaseEntity[]>(
              externalData,
              'categories.data',
              [],
            )

            if (!categories) return []

            return categories.map((c) => ({ label: c.title, value: c.id }))
          },
        }),
        buildTextField({
          id: 'application.caption',
          minLength: 1,
          required: true,
          title: m.draft.sections.advert.captionInput,
          marginBottom: [2, 3, 4],
        }),
        buildCustomField({
          id: 'application.html',
          component: 'AdvertField',
          marginBottom: [2, 3, 4],
        }),
        buildDescriptionField({
          id: 'draft.signature',
          title: m.draft.sections.signature.formTitle,
          titleVariant: 'h4',
          marginTop: [2, 3, 4],
        }),
        buildTextField({
          required: true,
          id: 'signature.location',
          title: m.draft.sections.signature.location,
          width: 'half',
          backgroundColor: 'blue',
        }),
        buildDateField({
          required: true,
          id: 'signature.date',
          title: m.draft.sections.signature.date,
          width: 'half',
          backgroundColor: 'blue',
          placeholder: () => {
            const now = new Date()

            return format(now, 'dd.MM.yyyy')
          },
        }),
        buildTextField({
          required: true,
          id: 'signature.name',
          title: m.draft.sections.signature.name,
          width: 'half',
          backgroundColor: 'blue',
        }),
      ],
    }),
  ],
})
