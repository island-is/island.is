import {
  buildDividerField,
  buildMultiField,
  buildOverviewField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import {
  formatPhoneNumber,
  removeCountryCode,
} from '@island.is/application/ui-components'

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
          id: 'overviewList',
          title: m.listOverviewHeader,
          marginTop: 'none',
          marginBottom: 'none',
          items: (answers) => [
            {
              width: 'full',
              keyText: m.listMunicipality,
              valueText: getValueViaPath(answers, 'list.municipality') ?? '',
            },
            {
              width: 'full',
              keyText: m.listName,
              valueText: getValueViaPath(answers, 'list.name') ?? '',
            },
          ],
        }),
        buildOverviewField({
          id: 'overviewApplicant',
          title: m.applicantOverviewHeader,
          marginTop: 'none',
          marginBottom: 'none',
          items: (answers) => [
            {
              width: 'half',
              keyText: m.nationalId,
              valueText: getValueViaPath(answers, 'applicant.nationalId') ?? '',
            },
            {
              width: 'half',
              keyText: m.name,
              valueText: getValueViaPath(answers, 'applicant.name') ?? '',
            },
            {
              width: 'half',
              keyText: m.phone,
              valueText: () => {
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
      ],
    }),
  ],
})
