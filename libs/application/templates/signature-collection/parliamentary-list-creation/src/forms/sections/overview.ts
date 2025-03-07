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
          items: ({ answers }) => {
            const constituency = getValueViaPath<string[]>(answers, 'constituency') || []
              return constituency?.map(
                (constituency) => ({
                  heading: constituency.split('|')[1],
                  eyebrow: getValueViaPath<string>(answers, 'list.name'),
                  progressMeter: {
                    currentProgress: 0,
                    maxProgress: 350,
                    withLabel: true,
                  },
                }),
              )
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
