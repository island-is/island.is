import {
  buildActionCardListField,
  buildDescriptionField,
  buildDividerField,
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import {
  formatPhoneNumber,
  removeCountryCode,
} from '@island.is/application/ui-components'
import { DefaultEvents } from '@island.is/application/types'
import { SignatureCollectionArea } from '@island.is/api/schema'

export const overview = buildSection({
  id: 'overview',
  title: m.overview,
  children: [
    buildMultiField({
      id: 'overview',
      title: m.overview,
      description: m.overviewDescription,
      children: [
        buildOverviewField({
          id: 'listOverview',
          title: m.listOverviewHeader,
          marginTop: 'none',
          marginBottom: 'none',
          titleVariant: 'h3',
          items: (answers) => [
            {
              width: 'full',
              keyText: m.listName,
              valueText: getValueViaPath(answers, 'list.name') ?? '',
            },
            {
              width: 'half',
              keyText: m.listLetter,
              valueText: getValueViaPath(answers, 'list.letter') ?? '',
            },
            {
              width: 'half',
              keyText: m.nationalId,
              valueText: getValueViaPath(answers, 'list.nationalId') ?? '',
            },
          ],
        }),
        buildOverviewField({
          id: 'applicantOverview',
          title: m.applicantOverviewHeader,
          marginTop: 'none',
          marginBottom: 'none',
          titleVariant: 'h3',
          items: (answers) => [
            {
              width: 'half',
              keyText: m.name,
              valueText: getValueViaPath(answers, 'applicant.name') ?? '',
            },
            {
              width: 'half',
              keyText: m.nationalId,
              valueText: getValueViaPath(answers, 'applicant.nationalId') ?? '',
            },
            {
              width: 'half',
              keyText: m.phone,
              valueText: ({ answers }) => {
                const phone =
                  getValueViaPath<string>(answers, 'applicant.phone') ?? ''
                return formatPhoneNumber(removeCountryCode(phone))
              },
            },
            {
              width: 'half',
              keyText: m.email,
              valueText: getValueViaPath(answers, 'applicant.email') ?? '',
            },
          ],
        }),
        buildDividerField({}),
        buildDescriptionField({
          id: 'createdListsOverview',
          title: m.listOverviewHeader,
          titleVariant: 'h3',
          space: 'containerGutter',
          marginBottom: 1,
        }),
        buildActionCardListField({
          id: 'createdListsInOverview',
          doesNotRequireAnswer: true,
          items: ({ externalData, answers }) => {
            // Constituencies selected by the user
            const selected =
              getValueViaPath<string[]>(answers, 'constituency') ?? []

            // Official list of constituencies with the correct order
            const areas = getValueViaPath<SignatureCollectionArea[]>(
              externalData,
              'parliamentaryCollection.data.areas',
            )

            // Build a lookup map: { id → index }
            const order = areas
              ? new Map(
                  areas.map((area, i) => [
                    area.id,
                    { index: i, max: area.min },
                  ]),
                )
              : null

            // Sort selected constituencies to match the official order
            const constituencies = order
              ? [...selected].sort(
                  (a, b) =>
                    (order.get(a.split('|')[0])?.index ?? 0) -
                    (order.get(b.split('|')[0])?.index ?? 0),
                )
              : selected

            // Map to display items
            return constituencies.map((c) => {
              const [id, name] = c.split('|')
              const max = order?.get(id)?.max ?? 0

              return {
                heading: name,
                eyebrow: getValueViaPath<string>(answers, 'list.name'),
                progressMeter: {
                  currentProgress: 0,
                  maxProgress: max,
                  withLabel: true,
                },
              }
            })
          },
        }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: m.createList,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.createList,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
