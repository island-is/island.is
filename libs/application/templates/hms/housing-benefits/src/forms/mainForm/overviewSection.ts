import {
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import { DefaultEvents, ExternalData } from '@island.is/application/types'
import * as m from '../../lib/messages'
import {
  personalInformationOverviewItems,
  rentalAgreementOverviewItems,
  exemptionSectionOverviewItems,
  exemptionSectionOverviewAttachments,
  householdMembersOverviewItems,
  householdMembersOverviewAttachments,
  mainFormAccessAgreementOverviewItems,
  mainFormAccessAgreementOverviewAttachments,
  incomeSectionOverviewItems,
  incomeNoTaxReturnOverviewItems,
  assetsDeclarationOverviewItems,
  paymentSectionOverviewItems,
} from '../../utils/getOverviewItems'
import { doesAddressMatchRentalContract } from '../../utils/rentalAgreementUtils'
import {
  hasNonCustodyMinorsInHousehold,
  isTaxReturnFiled,
  isTaxReturnNotFiled,
} from '../../utils/utils'

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
          id: 'mainFormAccessAgreementOverview',
          title: m.draftMessages.accessAgreementSection.title,
          backId: 'accessAgreementMultiField',
          condition: (answers, externalData) => {
            if (!getValueViaPath<string>(answers, 'rentalAgreement.answer')) {
              return false
            }
            if (!hasNonCustodyMinorsInHousehold(answers, externalData)) {
              return false
            }
            const items = mainFormAccessAgreementOverviewItems(
              answers,
              externalData,
            )
            const attachments = mainFormAccessAgreementOverviewAttachments(
              answers,
              externalData,
            )
            return items.length > 0 || attachments.length > 0
          },
          items: mainFormAccessAgreementOverviewItems,
          attachments: mainFormAccessAgreementOverviewAttachments,
        }),
        buildOverviewField({
          id: 'incomeSectionOverview',
          title: m.draftMessages.incomeSection.title,
          backId: 'incomeMultiField',
          condition: (answers, externalData) => {
            if (!isTaxReturnFiled(answers, externalData)) return false
            if (
              getValueViaPath<string>(answers, 'incomeHasOtherIncome') !== YES
            ) {
              return false
            }
            const emptyExternal = {} as ExternalData
            return incomeSectionOverviewItems(answers, emptyExternal).length > 0
          },
          items: incomeSectionOverviewItems,
        }),
        buildOverviewField({
          id: 'incomeNoTaxReturnOverview',
          title: m.draftMessages.incomeNoTaxReturnSection.title,
          backId: 'incomeNoTaxReturnMultiField',
          condition: isTaxReturnNotFiled,
          items: incomeNoTaxReturnOverviewItems,
        }),
        buildOverviewField({
          id: 'assetsDeclarationOverview',
          title: m.draftMessages.assetsDeclarationSection.title,
          backId: 'assetsDeclaration',
          condition: isTaxReturnNotFiled,
          items: assetsDeclarationOverviewItems,
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
