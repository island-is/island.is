import {
  buildCustomField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
} from '@island.is/application/core'
import { getYesNoOptions } from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import { oldAgePensionFormMessage } from '../../../lib/messages'
import {
  isResidenceHistory,
  isResidenceHistoryOrOnlyIcelandic,
} from '../../../utils/conditionUtils'

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
          condition: (_, externalData) => isResidenceHistory(externalData),
        }),
        buildRadioField({
          id: 'residenceHistory.question',
          title: oldAgePensionFormMessage.residence.residenceHistoryQuestion,
          options: getYesNoOptions(),
          width: 'half',
          largeButtons: true,
          condition: (_, externalData) =>
            isResidenceHistoryOrOnlyIcelandic(externalData),
        }),
      ],
    }),
  ],
})
