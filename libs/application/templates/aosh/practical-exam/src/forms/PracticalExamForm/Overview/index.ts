import {
  buildCheckboxField,
  buildMultiField,
  buildOverviewField,
  buildSection,
  YES,
} from '@island.is/application/core'
import { overview } from '../../../lib/messages'
import { getRegistrantInformationForOverview } from '../../../utils/getRegistrantInformationForOverview'
import { getPaymentArrangementForOverview, isCompany } from '../../../utils'
import { FormValue } from '@island.is/application/types'
import { getExamLocatioForOverview } from '../../../utils/getExamLocationForOverview'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: overview.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'overviewSection.multiField',
      title: overview.general.pageTitle,
      description:
        'Vinsamlegast farðu vel yfir allar upplýsingar hér að neðan áður en skráningin er send.',
      children: [
        buildOverviewField({
          id: 'overview.registrant',
          title: overview.registrant.title,
          titleVariant: 'h4',
          bottomLine: false,
          items: getRegistrantInformationForOverview,
        }),
        buildOverviewField({
          id: 'overview.examOthers',
          title: overview.exam.title,
          titleVariant: 'h4',
          // Add einstakling flow
          condition: (answers: FormValue) => !isCompany(answers),
        }),
        buildOverviewField({
          id: 'overview.examSelf',
          title: overview.exam.title,
          titleVariant: 'h4',
          condition: isCompany,
        }),
        buildOverviewField({
          id: 'overview.examLocation',
          title: overview.examLocation.title,
          titleVariant: 'h4',
          items: getExamLocatioForOverview,
        }),
        buildOverviewField({
          id: 'overview.paymentArrangement',
          title: overview.payment.title,
          titleVariant: 'h4',
          items: getPaymentArrangementForOverview,
        }),
        buildCheckboxField({
          id: 'paymentArrangement.agreementCheckbox',
          large: false,
          backgroundColor: 'white',
          marginTop: 3,
          options: [
            {
              value: YES,
              label: overview.labels.agreementCheckbox,
            },
          ],
        }),
      ],
    }),
  ],
})
