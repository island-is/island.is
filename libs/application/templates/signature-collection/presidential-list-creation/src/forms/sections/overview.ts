import {
  buildActionCardListField,
  buildDescriptionField,
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { SignatureCollectionArea } from '@island.is/api/schema'
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
          title: m.applicantOverviewHeader,
          titleVariant: 'h4',
          bottomLine: true,
          items: () => [
            {
              width: 'half',
              keyText: m.name,
              valueText: ({ answers }) =>
                getValueViaPath(answers, 'applicant.name'),
            },
            {
              width: 'half',
              keyText: m.nationalId,
              valueText: ({ answers }) =>
                getValueViaPath(answers, 'applicant.nationalId'),
            },
            {
              width: 'half',
              keyText: m.phone,
              valueText: ({ answers }) => {
                const phone = getValueViaPath<string>(
                  answers,
                  'applicant.phone',
                )
                return formatPhoneNumber(removeCountryCode(phone || ''))
              },
            },
            {
              width: 'half',
              keyText: m.email,
              valueText: ({ answers }) =>
                getValueViaPath(answers, 'applicant.email'),
            },
          ],
        }),
        buildDescriptionField({
          id: 'listOverview',
          title: m.listOverviewHeader,
          titleVariant: 'h4',
          marginBottom: 1,
          marginTop: 'gutter',
        }),
        buildActionCardListField({
          id: 'createdLists',
          title: m.listOverviewHeader,
          items: ({ answers, externalData }) => {
            const areas =
              getValueViaPath<SignatureCollectionArea[]>(
                externalData,
                'currentCollection.data.areas',
              ) || []
            return areas?.map((area) => ({
              heading: `${getValueViaPath(answers, 'applicant.name')} - ${
                area.name
              }`,
              eyebrow: `${m.listDateTil.defaultMessage}: ${getValueViaPath(
                answers,
                'collection.dateTil',
              )}`,
              progressMeter: {
                currentProgress: 0,
                maxProgress: area.min ?? 0,
                withLabel: true,
              },
            }))
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
