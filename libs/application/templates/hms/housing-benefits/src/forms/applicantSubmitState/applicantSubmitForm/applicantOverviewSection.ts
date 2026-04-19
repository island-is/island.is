import {
  buildMultiField,
  buildOverviewField,
  buildSection,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import { ExternalData } from '@island.is/application/types'
import * as m from '../../../lib/messages'
import { applicantSubmitMessages as asm } from '../../../lib/messages/applicantSubmitMessages'
import {
  personalInformationOverviewItems,
  rentalAgreementOverviewItems,
  exemptionSectionOverviewItems,
  exemptionSectionOverviewAttachments,
  householdMembersOverviewItems,
  householdMembersOverviewAttachments,
  incomeSectionOverviewItems,
  incomeSectionOverviewAttachments,
  incomeNoTaxReturnOverviewItems,
  incomeNoTaxReturnOverviewAttachments,
  assetsDeclarationOverviewItems,
  paymentSectionOverviewItems,
} from '../../../utils/getOverviewItems'
import { doesAddressMatchRentalContract } from '../../../utils/rentalAgreementUtils'
import { isTaxReturnFiled, isTaxReturnNotFiled } from '../../../utils/utils'

export const applicantOverviewSection = buildSection({
  id: 'applicantSubmitOverviewSection',
  tabTitle: asm.applicantOverviewSectionTitle,
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
          id: 'submitExemptionOverview',
          title: m.draftMessages.exemptionSection.title,
          condition: (answers, externalData) =>
            !doesAddressMatchRentalContract(answers, externalData),
          items: exemptionSectionOverviewItems,
          attachments: exemptionSectionOverviewAttachments,
        }),
        buildOverviewField({
          id: 'submitHouseholdMembersOverview',
          title: m.draftMessages.householdMembersSection.title,
          items: householdMembersOverviewItems,
          attachments: householdMembersOverviewAttachments,
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
      ],
    }),
  ],
})
