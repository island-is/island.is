import {
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import * as m from '../../lib/messages'
import {
  extraDataChangedCircumstancesOverviewAttachments,
  extraDataChangedCircumstancesOverviewItems,
  extraDataCustodyAgreementOverviewAttachments,
  extraDataCustodyAgreementOverviewItems,
  extraDataExemptionReasonOverviewAttachments,
  extraDataExemptionReasonOverviewItems,
} from '../../utils/getOverviewItems'
import {
  institutionRequestedChangedCircumstances,
  institutionRequestedCustodyAgreement,
  institutionRequestedExemptionReason,
} from '../../utils/extraDataFormConditions'

export const extraDataOverviewSection = buildSection({
  id: 'extraDataOverviewSection',
  title: m.extraDataMessages.overviewSectionTitle,
  children: [
    buildMultiField({
      id: 'extraDataOverviewMultiField',
      title: m.extraDataMessages.overviewSectionTitle,
      description: m.extraDataMessages.overviewDescription,
      children: [
        buildOverviewField({
          condition: institutionRequestedExemptionReason,
          id: 'extraDataOverviewExemptionReason',
          title: m.extraDataMessages.documentExemptionReason,
          backId: 'extraDataExemptionMultiField',
          items: extraDataExemptionReasonOverviewItems,
          attachments: extraDataExemptionReasonOverviewAttachments,
        }),
        buildOverviewField({
          condition: institutionRequestedCustodyAgreement,
          id: 'extraDataOverviewCustodyAgreement',
          title: m.extraDataMessages.documentCustodyAgreement,
          backId: 'extraDataCustodyMultiField',
          items: extraDataCustodyAgreementOverviewItems,
          attachments: extraDataCustodyAgreementOverviewAttachments,
        }),
        buildOverviewField({
          condition: institutionRequestedChangedCircumstances,
          id: 'extraDataOverviewChangedCircumstances',
          title: m.extraDataMessages.documentChangedCircumstances,
          backId: 'extraDataCircumstancesMultiField',
          items: extraDataChangedCircumstancesOverviewItems,
          attachments: extraDataChangedCircumstancesOverviewAttachments,
        }),
        buildSubmitField({
          id: 'extraDataSubmit',
          placement: 'footer',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.extraDataMessages.submitButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
