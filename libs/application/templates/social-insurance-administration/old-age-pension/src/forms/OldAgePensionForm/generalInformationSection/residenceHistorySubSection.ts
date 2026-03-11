import {
  buildCustomField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
} from '@island.is/application/core'
import { IS } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { getYesNoOptions } from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import { oldAgePensionFormMessage } from '../../../lib/messages'
import { getApplicationExternalData } from '../../../utils/oldAgePensionUtils'

export const residenceHistorySubSection = buildSubSection({
  id: 'residenceHistorySubSection',
  title: oldAgePensionFormMessage.residence.residenceHistoryTitle,
  children: [
    buildMultiField({
      id: 'residenceHistory',
      title: oldAgePensionFormMessage.residence.residenceHistoryTitle,
      description:
        oldAgePensionFormMessage.residence.residenceHistoryDescription,
      children: [
        buildCustomField({
          id: 'residenceHistory.table',
          doesNotRequireAnswer: true,
          component: 'ResidenceHistory',
          condition: (_, externalData) => {
            const { residenceHistory } =
              getApplicationExternalData(externalData)
            // if no residence history returned, dont show the table
            if (residenceHistory.length === 0) return false
            return true
          },
        }),
        buildRadioField({
          id: 'residenceHistory.question',
          title: oldAgePensionFormMessage.residence.residenceHistoryQuestion,
          options: getYesNoOptions(),
          width: 'half',
          largeButtons: true,
          condition: (_, externalData) => {
            const { residenceHistory } =
              getApplicationExternalData(externalData)
            // if no residence history returned or if residence history is only iceland, show the question
            if (residenceHistory.length === 0) return true
            return residenceHistory.every(
              (residence) => residence.country === IS,
            )
          },
        }),
      ],
    }),
  ],
})
