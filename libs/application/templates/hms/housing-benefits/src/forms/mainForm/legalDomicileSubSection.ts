import {
  buildAlertMessageField,
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
} from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import * as m from '../../lib/messages'
import { LegalDomicileOption } from '../../utils/constants'
import { shouldShowLegalDomicileSection } from '../../utils/conditions'
import { doesAddressMatchRentalContract } from '../../utils/rentalAgreementUtils'
import { isExemptionRequested } from '../../utils/utils'

const isRefetchOptionVisible = (answers: FormValue) =>
  !isExemptionRequested(answers)

export const legalDomicileSubSection = buildSubSection({
  condition: shouldShowLegalDomicileSection,
  id: 'legalDomicileSubSection',
  title: m.draftMessages.legalDomicileSection.title,
  children: [
    buildMultiField({
      id: 'legalDomicileMultiField',
      title: m.draftMessages.legalDomicileSection.multiFieldTitle,
      children: [
        buildAlertMessageField({
          id: 'legalDomicileMismatchAlert',
          condition: (answers, externalData) =>
            !doesAddressMatchRentalContract(answers, externalData),
          title: m.draftMessages.legalDomicileSection.mismatchAlertTitle,
          message: m.draftMessages.legalDomicileSection.mismatchAlertMessage,
          alertType: 'error',
          marginTop: 0,
          marginBottom: 4,
          links: [
            {
              title:
                m.draftMessages.legalDomicileSection.mismatchAlertLinkTitle,
              url: m.draftMessages.legalDomicileSection.mismatchAlertLinkUrl,
              isExternal: true,
              icon: 'arrowForward',
            },
          ],
        }),
        buildAlertMessageField({
          id: 'legalDomicileUpdatedAlert',
          condition: doesAddressMatchRentalContract,
          title: m.draftMessages.legalDomicileSection.updatedAlertTitle,
          message: m.draftMessages.legalDomicileSection.updatedAlertMessage,
          alertType: 'success',
          marginTop: 0,
          marginBottom: 4,
        }),
        buildCustomField({
          id: 'legalDomicileRegisteredAddress',
          component: 'RegisteredLegalDomicile',
          condition: isRefetchOptionVisible,
        }),
        buildDescriptionField({
          id: 'legalDomicileDescription',
          description: m.draftMessages.legalDomicileSection.description,
        }),
        buildRadioField({
          id: 'legalDomicileOption',
          width: 'half',
          largeButtons: true,
          defaultValue: LegalDomicileOption.NATIONAL_REGISTRY,
          clearOnChange: ['exemptionReason'],
          marginBottom: 2,
          options: [
            {
              value: LegalDomicileOption.NATIONAL_REGISTRY,
              label:
                m.draftMessages.legalDomicileSection.optionNationalRegistry,
            },
            {
              value: LegalDomicileOption.EXEMPTION,
              label: m.draftMessages.legalDomicileSection.optionExemption,
            },
          ],
        }),
        buildCustomField({
          id: 'legalDomicileRefetch',
          component: 'RefetchLegalDomicile',
          condition: isRefetchOptionVisible,
        }),
        buildDescriptionField({
          id: 'exemptionDescription',
          condition: isExemptionRequested,
          title: m.draftMessages.exemptionSection.reasonTitle,
          titleVariant: 'h4',
          description: m.draftMessages.exemptionSection.description2,
          marginTop: 2,
          marginBottom: 2,
        }),
        buildRadioField({
          id: 'exemptionReason',
          condition: isExemptionRequested,
          title: m.draftMessages.exemptionSection.reasonRadioTitle,
          titleVariant: 'h4',
          largeButtons: true,
          options: [
            {
              value: 'studies',
              label: m.draftMessages.exemptionSection.checkboxLabelStudies,
            },
            {
              value: 'health',
              label: m.draftMessages.exemptionSection.checkboxLabelHealth,
            },
            {
              value: 'housing',
              label: m.draftMessages.exemptionSection.checkboxLabelHousing,
            },
            {
              value: 'work',
              label: m.draftMessages.exemptionSection.checkboxLabelWork,
            },
          ],
        }),
      ],
    }),
  ],
})
