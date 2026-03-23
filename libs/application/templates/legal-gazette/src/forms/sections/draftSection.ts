import {
  buildSection,
  buildMultiField,
  buildDescriptionField,
  buildSelectField,
  getValueViaPath,
  buildTextField,
  buildCustomField,
  buildDateField,
  buildAsyncSelectField,
} from '@island.is/application/core'
import format from 'date-fns/format'
import { m } from '../../lib/messages'
import { LGBaseEntity } from '../../utils/types'
import { LEGAL_GAZETTE_CATEGORIES_QUERY } from '../../graphql'

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
          id: 'application.typeId',
          title: m.draft.sections.advert.typeInput,
          width: 'half',
          required: true,
          options: ({ externalData }) => {
            const types =
              getValueViaPath<LGBaseEntity[]>(externalData, 'types.data', []) ??
              []

            return types.map((c) => ({ label: c.title, value: c.id }))
          },
        }),
        buildAsyncSelectField({
          id: 'application.categoryId',
          title: m.draft.sections.advert.categoryInput,
          width: 'half',
          updateOnSelect: ['application.typeId'],
          required: true,
          loadOptions: async ({ apolloClient, selectedValues }) => {
            if (!selectedValues || selectedValues.length === 0) return []

            const { data } = await apolloClient.query({
              query: LEGAL_GAZETTE_CATEGORIES_QUERY,
              variables: { input: { typeId: selectedValues[0] } },
            })

            const options = data.legalGazetteCategories.categories.map(
              (c: LGBaseEntity) => ({
                label: c.title,
                value: c.id,
              }),
            )

            return options
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
          description: m.errors.emptySignature,
          titleVariant: 'h4',
          marginTop: [2, 3, 4],
        }),

        buildTextField({
          id: 'signature.name',
          title: m.draft.sections.signature.name,
          placeholder: m.draft.sections.signature.namePlaceholder,
          width: 'half',
          backgroundColor: 'blue',
        }),
        buildTextField({
          id: 'signature.location',
          title: m.draft.sections.signature.location,
          placeholder: m.draft.sections.signature.locationPlaceholder,
          width: 'half',
          backgroundColor: 'blue',
        }),
        buildDateField({
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
          id: 'signature.onBehalfOf',
          title: m.draft.sections.signature.onBehalfOf,
          placeholder: m.draft.sections.signature.onBehalfOfPlaceholder,
          width: 'half',
          backgroundColor: 'blue',
        }),
      ],
    }),
  ],
})
