import {
  buildAlertMessageField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
} from '@island.is/application/core'
import { NO, YES } from '@island.is/application/types'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../lib/newPrimarySchoolUtils'

export const useOfFootageSubSection = buildSubSection({
  id: 'useOfFootageSubSection',
  title: newPrimarySchoolMessages.differentNeeds.useOfFootageSubSectionTitle,
  children: [
    buildMultiField({
      id: 'photography',
      title: newPrimarySchoolMessages.differentNeeds.photography,
      description:
        newPrimarySchoolMessages.differentNeeds.photographyDescription,
      children: [
        buildRadioField({
          id: 'photography.photographyConsent',
          title: newPrimarySchoolMessages.differentNeeds.photographyConsent,
          width: 'half',
          required: true,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              dataTestId: 'yes-option',
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              dataTestId: 'no-option',
              value: NO,
            },
          ],
        }),
        buildRadioField({
          id: 'photography.photoSchoolPublication',
          condition: (answers) => {
            const { photographyConsent } = getApplicationAnswers(answers)
            return photographyConsent === YES
          },
          title: newPrimarySchoolMessages.differentNeeds.photoSchoolPublication,
          width: 'half',
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              dataTestId: 'yes-option',
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              dataTestId: 'no-option',
              value: NO,
            },
          ],
        }),
        buildRadioField({
          id: 'photography.photoMediaPublication',
          condition: (answers) => {
            const { photographyConsent } = getApplicationAnswers(answers)
            return photographyConsent === YES
          },
          title: newPrimarySchoolMessages.differentNeeds.photoMediaPublication,
          width: 'half',
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              dataTestId: 'yes-option',
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              dataTestId: 'no-option',
              value: NO,
            },
          ],
        }),
        buildAlertMessageField({
          id: 'differentNeeds.photographyInfo',
          title: newPrimarySchoolMessages.shared.alertTitle,
          message: newPrimarySchoolMessages.differentNeeds.photographyInfo,
          doesNotRequireAnswer: true,
          alertType: 'info',
        }),
      ],
    }),
  ],
})
