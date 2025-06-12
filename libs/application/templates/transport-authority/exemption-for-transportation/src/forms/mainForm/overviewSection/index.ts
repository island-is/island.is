import {
  buildCheckboxField,
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
  YES,
} from '@island.is/application/core'
import {
  getExemptionPeriodOverviewItems,
  getLongTermLocationOverviewAttachments,
  getLongTermLocationOverviewItems,
  getShortTermLocationOverviewItems,
  getSupportingDocumentsOverviewAttachments,
  getSupportingDocumentsOverviewItems,
  getUserInformationOverviewItems,
  checkIfExemptionTypeLongTerm,
  checkIfExemptionTypeShortTerm,
} from '../../../utils'
import { overview } from '../../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: overview.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'overviewSection',
      title: overview.general.pageTitle,
      children: [
        buildOverviewField({
          id: 'overview.userInformation',
          title: overview.userInformation.subtitle,
          backId: 'userInformationMultiField',
          bottomLine: true,
          items: getUserInformationOverviewItems,
        }),
        buildOverviewField({
          id: 'overview.exemptionPeriod',
          title: overview.exemptionPeriod.subtitle,
          backId: 'exemptionPeriodMultiField',
          bottomLine: true,
          items: getExemptionPeriodOverviewItems,
        }),
        buildOverviewField({
          id: 'overview.shortTermlocation',
          title: overview.shortTermlocation.subtitle,
          backId: 'locationMultiField',
          bottomLine: true,
          items: getShortTermLocationOverviewItems,
          condition: (answers) => {
            return checkIfExemptionTypeShortTerm(answers)
          },
        }),
        buildOverviewField({
          id: 'overview.longTermlocation',
          title: overview.longTermlocation.subtitle,
          backId: 'locationMultiField',
          bottomLine: true,
          items: getLongTermLocationOverviewItems,
          attachments: getLongTermLocationOverviewAttachments,
          condition: (answers) => {
            return checkIfExemptionTypeLongTerm(answers)
          },
        }),
        buildOverviewField({
          id: 'overview.supportingDocuments',
          title: overview.supportingDocuments.subtitle,
          backId: 'supportingDocumentsMultiField',
          bottomLine: true,
          items: getSupportingDocumentsOverviewItems,
          attachments: getSupportingDocumentsOverviewAttachments,
          hideIfEmpty: true,
        }),
        buildCheckboxField({
          id: 'agreementCheckbox',
          large: true,
          backgroundColor: 'blue',
          marginTop: 3,
          options: [
            {
              value: YES,
              label: overview.buttons.confirm,
            },
          ],
        }),
        buildSubmitField({
          id: 'submit',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: overview.buttons.submit,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
