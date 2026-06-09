import {
  buildMultiField,
  buildOverviewField,
  buildRadioField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
  NO,
  YES,
} from '@island.is/application/core'
import { DefaultEvents, ExternalData } from '@island.is/application/types'
import * as m from '../../../lib/messages'
import { applicantSubmitMessages as asm } from '../../../lib/messages/applicantSubmitMessages'
import {
  personalInformationOverviewItems,
  rentalAgreementOverviewItems,
  exemptionSectionOverviewItems,
  exemptionSectionOverviewAttachments,
  applicantSubmitHouseholdMembersOverviewItems,
  applicantSubmitHouseholdMembersOverviewAttachments,
  incomeSectionOverviewItems,
  incomeSectionOverviewAttachments,
  incomeNoTaxReturnOverviewItems,
  incomeNoTaxReturnOverviewAttachments,
  assetsDeclarationOverviewItems,
  paymentSectionOverviewItems,
  applicantSubmitAccessAgreementOverviewAttachments,
} from '../../../utils/getOverviewItems'
import { shouldShowApplicantSubmitAccessAgreementSection } from '../../../utils/assigneeUtils'
import { doesAddressMatchRentalContract } from '../../../utils/rentalAgreementUtils'
import { isTaxReturnFiled, isTaxReturnNotFiled } from '../../../utils/utils'

export const applicantOverviewSection = buildSection({
  id: 'applicantSubmitOverviewSection',
  title: asm.applicantOverviewSectionTitle,
  children: [
    buildMultiField({
      id: 'applicantSubmitOverviewMultiField',
      title: asm.applicantOverviewTitle,
      description: asm.applicantOverviewDescription,
      children: [
        buildOverviewField({
          id: 'submitPersonalInfoOverview',
          title: m.draftMessages.personalInformation.title,
          items: personalInformationOverviewItems,
        }),
        buildOverviewField({
          id: 'submitRentalAgreementOverview',
          title: m.draftMessages.rentalAgreement.title,
          items: rentalAgreementOverviewItems,
        }),
        buildOverviewField({
          id: 'submitApplicantSubmitAccessAgreementOverview',
          title: asm.applicantSubmitAccessAgreementTitle,
          backId: 'applicantSubmitAccessAgreement',
          condition: (answers, externalData) =>
            shouldShowApplicantSubmitAccessAgreementSection(
              answers,
              externalData,
            ) ||
            applicantSubmitAccessAgreementOverviewAttachments(
              answers,
              externalData,
            ).length > 0,
          attachments: applicantSubmitAccessAgreementOverviewAttachments,
          hideIfEmpty: true,
        }),
        buildOverviewField({
          id: 'submitExemptionOverview',
          title: m.draftMessages.exemptionSection.title,
          condition: (answers, externalData) =>
            !doesAddressMatchRentalContract(answers, externalData),
          items: exemptionSectionOverviewItems,
          attachments: exemptionSectionOverviewAttachments,
        }),
        buildOverviewField({
          id: 'submitIncomeOverview',
          title: m.draftMessages.incomeSection.title,
          condition: (answers, externalData) => {
            if (!isTaxReturnFiled(answers, externalData)) return false
            if (
              getValueViaPath<string>(answers, 'incomeHasOtherIncome') !== YES
            ) {
              return false
            }
            const emptyExternal = {} as ExternalData
            const items = incomeSectionOverviewItems(answers, emptyExternal)
            const attachments = incomeSectionOverviewAttachments(
              answers,
              emptyExternal,
            )
            return items.length > 0 || attachments.length > 0
          },
          items: incomeSectionOverviewItems,
          attachments: incomeSectionOverviewAttachments,
        }),
        buildOverviewField({
          id: 'submitIncomeNoTaxReturnOverview',
          title: m.draftMessages.incomeNoTaxReturnSection.title,
          condition: isTaxReturnNotFiled,
          items: incomeNoTaxReturnOverviewItems,
          attachments: incomeNoTaxReturnOverviewAttachments,
        }),
        buildOverviewField({
          id: 'submitAssetsDeclarationOverview',
          title: m.draftMessages.assetsDeclarationSection.title,
          condition: isTaxReturnNotFiled,
          items: assetsDeclarationOverviewItems,
        }),
        buildOverviewField({
          id: 'submitPaymentOverview',
          title: m.draftMessages.paymentSection.title,
          items: paymentSectionOverviewItems,
        }),
        buildOverviewField({
          id: 'submitHouseholdMembersOverview',
          title: m.draftMessages.householdMembersSection.title,
          items: applicantSubmitHouseholdMembersOverviewItems,
          attachments: applicantSubmitHouseholdMembersOverviewAttachments,
        }),
        buildRadioField({
          id: 'submitAddAssigneeRadio',
          title: 'Bæta við heimilismanni',
          options: [
            { label: m.miscMessages.yes, value: YES },
            { label: m.miscMessages.no, value: NO },
          ],
        }),
        buildSubmitField({
          condition: (answers) =>
            getValueViaPath(answers, 'submitAddAssigneeRadio') === YES,
          id: 'submitAddAssigneeSubmit',
          title: 'Bæta við heimilismanni',
          placement: 'footer',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.EDIT,
              name: 'Bæta við heimilismanni',
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
