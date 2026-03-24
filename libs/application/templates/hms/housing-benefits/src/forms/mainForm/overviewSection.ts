import {
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import * as m from '../../lib/messages'
import {
  personalInformationOverviewItems,
  rentalAgreementOverviewItems,
  exemptionSectionOverviewItems,
  exemptionSectionOverviewAttachments,
  householdMembersOverviewItems,
  householdMembersOverviewAttachments,
  incomeSectionOverviewItems,
  incomeSectionOverviewAttachments,
  paymentSectionOverviewItems,
} from '../../utils/getOverviewItems'
import { doesAddressMatchRentalContract } from '../../utils/rentalAgreementUtils'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: m.draftMessages.overviewSection.title,
  children: [
    buildMultiField({
      id: 'overviewSection',
      title: m.draftMessages.overviewSection.title,
      description: m.draftMessages.overviewSection.description,
      children: [
        buildOverviewField({
          id: 'personalInformationOverview',
          title: m.draftMessages.personalInformation.title,
          backId: 'applicant',
          items: personalInformationOverviewItems,
        }),
        buildOverviewField({
          id: 'rentalAgreementOverview',
          title: m.draftMessages.rentalAgreement.title,
          backId: 'rentalAgreementMultiField',
          items: rentalAgreementOverviewItems,
        }),
        buildOverviewField({
          id: 'exemptionSectionOverview',
          title: m.draftMessages.exemptionSection.title,
          backId: 'exemptionMultiField',
          condition: (answers, externalData) =>
            !doesAddressMatchRentalContract(answers, externalData),
          items: exemptionSectionOverviewItems,
          attachments: exemptionSectionOverviewAttachments,
        }),
        buildOverviewField({
          id: 'householdMembersOverview',
          title: m.draftMessages.householdMembersSection.title,
          backId: 'householdMembersMultiField',
          items: householdMembersOverviewItems,
          attachments: householdMembersOverviewAttachments,
        }),
        buildOverviewField({
          id: 'incomeSectionOverview',
          title: m.draftMessages.incomeSection.title,
          backId: 'incomeMultiField',
          condition: (answers) => {
            const files = getValueViaPath<
              Array<{ key: string; name: string }>
            >(answers, 'incomeFileUploadField')
            const hasFiles = Array.isArray(files) && files.length > 0
            const text = getValueViaPath<string>(answers, 'incomeTextField')
            const hasText = typeof text === 'string' && text.trim().length > 0
            return hasFiles || hasText
          },
          items: incomeSectionOverviewItems,
          attachments: incomeSectionOverviewAttachments,
        }),
        buildOverviewField({
          id: 'paymentSectionOverview',
          title: m.draftMessages.paymentSection.title,
          backId: 'paymentMultiField',
          items: paymentSectionOverviewItems,
        }),
        buildSubmitField({
          id: 'submit',
          title: m.draftMessages.overviewSection.submit,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.draftMessages.overviewSection.submit,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
