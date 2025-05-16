import {
  buildCheckboxField,
  buildMultiField,
  buildOverviewField,
  buildSection,
  YES,
} from '@island.is/application/core'
import { overview } from '../../../lib/messages'
import { getRegistrantInformationForOverview } from '../../../utils/getRegistrantInformationForOverview'
import { getPaymentArrangementForOverview } from '../../../utils'
import { getExamLocationForOverview } from '../../../utils/getExamLocationForOverview'
import { getExamInformationOthersForOverview } from '../../../utils/getExamInformationOthersForOverview'
import { getExamInformationSelfForOverview } from '../../../utils/getExamInformationSelfForOverview'
import { isOthersPath, isSelfPath } from '../../../utils/isForSelfOrOthers'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: overview.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'overviewSection.multiField',
      title: overview.general.pageTitle,
      description: overview.general.description,
      children: [
        buildOverviewField({
          id: 'overview.registrant',
          title: '',
          titleVariant: 'h4',
          bottomLine: false,
          items: getRegistrantInformationForOverview,
        }),
        buildOverviewField({
          id: 'overview.examSelf',
          title: '',
          titleVariant: 'h4',
          items: getExamInformationSelfForOverview,
          condition: isSelfPath,
        }),
        buildOverviewField({
          id: 'overview.examOthers',
          title: overview.exam.title,
          titleVariant: 'h4',
          tableData: getExamInformationOthersForOverview,
          condition: isOthersPath,
        }),
        buildOverviewField({
          id: 'overview.examLocation',
          title: '',
          titleVariant: 'h4',
          items: getExamLocationForOverview,
        }),
        buildOverviewField({
          id: 'overview.paymentArrangement',
          title: '',
          titleVariant: 'h4',
          items: getPaymentArrangementForOverview,
        }),
        buildCheckboxField({
          id: 'overview.agreementCheckbox',
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
