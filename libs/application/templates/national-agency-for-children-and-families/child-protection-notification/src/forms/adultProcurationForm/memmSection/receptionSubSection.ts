import {
  NO,
  YES,
  buildAlertMessageField,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
} from '@island.is/application/core'
import { memmMessages, sharedMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../utils/getApplicationAnswers'

const MOTTAKA_OPTIONS = [
  { value: YES, label: sharedMessages.radioYes },
  { value: NO, label: sharedMessages.radioNo },
  { value: 'doNotKnow', label: memmMessages.reception.optionDoNotKnow },
  { value: 'notApplicable', label: memmMessages.reception.optionNotApplicable },
]

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
          titleVariant: 'h4',
          space: 2,
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
          options: MOTTAKA_OPTIONS,
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
          options: MOTTAKA_OPTIONS,
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
