import {
  buildCheckboxField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
} from '@island.is/application/core'
import { NO, YES } from '@island.is/application/types'
import { newPrimarySchoolMessages } from '../../../lib/messages'

export const supportSubSection = buildSubSection({
  id: 'supportSubSection',
  title: newPrimarySchoolMessages.differentNeeds.supportSubSectionTitle,
  children: [
    buildMultiField({
      id: 'support',
      title: newPrimarySchoolMessages.differentNeeds.support,
      description: newPrimarySchoolMessages.differentNeeds.supportDescription,
      children: [
        buildRadioField({
          id: 'support.developmentalAssessment',
          title:
            newPrimarySchoolMessages.differentNeeds.developmentalAssessment,
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
          id: 'support.specialSupport',
          title: newPrimarySchoolMessages.differentNeeds.specialSupport,
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
        buildCheckboxField({
          id: 'support.requestMeeting',
          title: '',
          description: newPrimarySchoolMessages.differentNeeds.requestMeeting,
          options: [
            {
              value: YES,
              label:
                newPrimarySchoolMessages.differentNeeds
                  .requestMeetingDescription,
            },
          ],
        }),
      ],
    }),
  ],
})
