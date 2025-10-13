import {
  buildAlertMessageField,
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  YES,
} from '@island.is/application/core'
import { reportingObligation } from '../../lib/messages'

export const reportingObligationSection = buildSection({
  id: 'reportingObligationSection',
  tabTitle: reportingObligation.pageTitle,
  children: [
    buildMultiField({
      id: 'reportObligationMultiField',
      title: reportingObligation.pageTitle,
      children: [
        buildDescriptionField({
          id: 'reportingObligationTitle',
          description: reportingObligation.subTitle,
          titleVariant: 'h5',
          marginBottom: 2,
        }),
        buildDescriptionField({
          id: 'reportingObligationDescription',
          description: reportingObligation.description,
          marginBottom: 2,
        }),
        buildDescriptionField({
          id: 'reportingObligationSecondSubtitle',
          description: reportingObligation.secondSubTitle,
          titleVariant: 'h5',
          marginBottom: 2,
        }),
        buildAlertMessageField({
          id: 'reportingObligationAlertField',
          alertType: 'info',
          title: reportingObligation.alertInfoTitle,
          message: reportingObligation.alertInfoMessage,
        }),
        buildCheckboxField({
          id: 'approveReportingObligation',
          required: true,
          options: [
            {
              value: YES,
              label: reportingObligation.checkboxText,
            },
          ],
        }),
      ],
    }),
  ],
})
