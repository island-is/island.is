import {
  buildAlertMessageField,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
} from '@island.is/application/core'
import { memmMessages } from '../../../lib/messages'
import { getYesNoDoNotKnowNotApplicableOptions } from '../../../utils/childProtectionNotificationUtils'
import { getApplicationAnswers } from '../../../utils/getApplicationAnswers'

export const receptionSubSection = buildSubSection({
  id: 'memmReceptionSubSection',
  title: memmMessages.reception.subSectionTitle,
  children: [
    buildMultiField({
      id: 'memm.reception',
      title: memmMessages.shared.pageTitle,
      description: memmMessages.shared.pageDescription,
      children: [
        buildDescriptionField({
          id: 'memm.reception.heading',
          title: memmMessages.reception.subSectionTitle,
          description: memmMessages.reception.description,
          titleVariant: 'h3',
          space: 0,
        }),
        buildDescriptionField({
          id: 'memm.reception.seekingAsylumLabel',
          title: memmMessages.reception.seekingAsylumLabel,
          titleTooltip: memmMessages.reception.seekingAsylumTooltip,
          titleVariant: 'h5',
          space: 3,
        }),
        buildRadioField({
          id: 'memm.reception.seekingAsylum',
          width: 'half',
          doesNotRequireAnswer: true,
          space: 0,
          options: getYesNoDoNotKnowNotApplicableOptions(),
        }),
        buildDescriptionField({
          id: 'memm.reception.refugeeStatusLabel',
          title: memmMessages.reception.refugeeStatusLabel,
          titleTooltip: memmMessages.reception.refugeeStatusTooltip,
          titleVariant: 'h5',
          space: 3,
        }),
        buildRadioField({
          id: 'memm.reception.refugeeStatus',
          width: 'half',
          doesNotRequireAnswer: true,
          space: 0,
          options: getYesNoDoNotKnowNotApplicableOptions(),
        }),
        buildAlertMessageField({
          id: 'memm.reception.fetchedDataInfo',
          alertType: 'info',
          message: memmMessages.reception.fetchedDataInfo,
          condition: (answers) => !!getApplicationAnswers(answers).childName,
        }),
      ],
    }),
  ],
})
