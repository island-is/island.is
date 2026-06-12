import {
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import {
  getCapitalIncomeOverviewItems,
  getCasualWorkOverviewItems,
  getContractWorkOverviewItems,
  getIncomeTypeOverviewItems,
  getPartTimeOverviewItems,
  getPensionOverviewItems,
  getSocialInsuranceOverviewItems,
} from '../../utils/getOverviewItems'
import {
  isCapitalIncome,
  isCasualWork,
  isContractWork,
  isPartTime,
  isPension,
  isSocialInsurance,
} from '../../utils/conditions'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: m.application.overviewSectionTitle,
  children: [
    buildMultiField({
      id: 'overviewMultiField',
      title: m.application.overviewSectionTitle,
      description: m.application.overviewSectionDescription,
      children: [
        buildOverviewField({
          id: 'overviewIncomeType',
          title: m.application.incomeSectionTitle,
          backId: 'incomeType',
          bottomLine: false,
          items: getIncomeTypeOverviewItems,
        }),
        buildOverviewField({
          id: 'overviewCasualWork',
          title: m.application.casualWorkHeading,
          backId: 'casualWorkMultiField',
          bottomLine: false,
          condition: isCasualWork,
          items: getCasualWorkOverviewItems,
        }),
        buildOverviewField({
          id: 'overviewPartTime',
          title: m.application.partTimeHeading,
          backId: 'partTimeMultiField',
          bottomLine: false,
          condition: isPartTime,
          items: getPartTimeOverviewItems,
        }),
        buildOverviewField({
          id: 'overviewContractWork',
          title: m.application.contractWorkHeading,
          backId: 'contractWorkMultiField',
          bottomLine: false,
          condition: isContractWork,
          items: getContractWorkOverviewItems,
        }),
        buildOverviewField({
          id: 'overviewPension',
          title: m.application.pensionHeading,
          backId: 'pensionMultiField',
          bottomLine: false,
          condition: isPension,
          items: getPensionOverviewItems,
        }),
        buildOverviewField({
          id: 'overviewCapitalIncome',
          title: m.application.capitalIncomeHeading,
          backId: 'capitalIncomeMultiField',
          bottomLine: false,
          condition: isCapitalIncome,
          items: getCapitalIncomeOverviewItems,
        }),
        buildOverviewField({
          id: 'overviewSocialInsurance',
          title: m.application.socialInsuranceHeading,
          backId: 'socialInsuranceMultiField',
          bottomLine: false,
          condition: isSocialInsurance,
          items: getSocialInsuranceOverviewItems,
        }),
        buildSubmitField({
          id: 'submit',
          title: m.application.submitButton,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: 'SUBMIT',
              name: m.application.submitButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
