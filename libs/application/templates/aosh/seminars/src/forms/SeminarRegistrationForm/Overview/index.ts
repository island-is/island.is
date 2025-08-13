import {
  buildCheckboxField,
  buildMultiField,
  buildOverviewField,
  buildSection,
  YES,
} from '@island.is/application/core'
import { overview, paymentArrangement } from '../../../lib/messages'
import {
  getOverviewTable,
  getPaymentArrangementForOverviewMultiple,
  getPaymentArrangementForOverviewSingle,
  getPersonalInformationForOverview,
  getSeminarInformationForOverview,
  isApplyingForMultiple,
  isSinglePaymentArrangement,
} from '../../../utils'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: overview.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'overviewSection.multiField',
      title: overview.general.pageTitle,
      children: [
        buildOverviewField({
          id: 'overviewSeminarInformation',
          title: overview.labels.seminar,
          bottomLine: false,
          items: getSeminarInformationForOverview,
        }),
        buildOverviewField({
          id: 'overviewPersonalInformation',
          title: overview.labels.personalInfo,
          bottomLine: false,
          items: getPersonalInformationForOverview,
        }),
        buildOverviewField({
          id: 'overviewPaymentArrangementSingle',
          title: overview.labels.paymentArrangement,
          bottomLine: false,
          items: getPaymentArrangementForOverviewSingle,
          condition: isSinglePaymentArrangement,
        }),
        buildOverviewField({
          id: 'overviewTable',
          title: overview.labels.participants,
          backId: 'participantsMultiField',
          bottomLine: true,
          tableData: getOverviewTable,
          condition: isApplyingForMultiple,
        }),
        buildOverviewField({
          id: 'overviewPaymentArrangementMultiple',
          title: overview.labels.paymentArrangement,
          backId: 'paymentArrangementMultiField',
          bottomLine: false,
          items: getPaymentArrangementForOverviewMultiple,
          condition: (answers) => !isSinglePaymentArrangement(answers),
        }),
        buildCheckboxField({
          id: 'paymentAgreementCheckbox',
          large: false,
          backgroundColor: 'white',
          marginTop: 3,
          options: [
            {
              value: YES,
              label: paymentArrangement.labels.agreementCheckbox,
            },
          ],
        }),
      ],
    }),
  ],
})
