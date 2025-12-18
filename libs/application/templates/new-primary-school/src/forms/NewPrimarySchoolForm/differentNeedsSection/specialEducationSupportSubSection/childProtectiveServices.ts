import { buildRadioField, NO, YES } from '@island.is/application/core'
import {
  differentNeedsMessages,
  sharedMessages,
} from '../../../../lib/messages'
import { hasBehaviorSchoolOrDepartmentSubType } from '../../../../utils/conditionUtils'
import { getApplicationAnswers } from '../../../../utils/newPrimarySchoolUtils'

export const childProtectiveServices = [
  buildRadioField({
    id: 'specialEducationSupport.hasBeenReportedToChildProtectiveServices',
    title:
      differentNeedsMessages.specialEducationSupport
        .hasBeenReportedToChildProtectiveServices,
    width: 'half',
    required: true,
    space: 4,
    options: [
      {
        label: sharedMessages.yes,
        dataTestId: 'has-been-reported-to-child-protective-services',
        value: YES,
      },
      {
        label: sharedMessages.no,
        dataTestId: 'no-has-been-reported-to-child-protective-services',
        value: NO,
      },
    ],
    condition: hasBehaviorSchoolOrDepartmentSubType,
  }),
  buildRadioField({
    id: 'specialEducationSupport.isCaseOpenWithChildProtectiveServices',
    title:
      differentNeedsMessages.specialEducationSupport
        .isCaseOpenWithChildProtectiveServices,
    width: 'half',
    required: true,
    space: 4,
    options: [
      {
        label: sharedMessages.yes,
        dataTestId: 'is-case-open-with-child-protective-services',
        value: YES,
      },
      {
        label: sharedMessages.no,
        dataTestId: 'no-is-case-open-with-child-protective-services',
        value: NO,
      },
    ],
    condition: (answers, externalData) => {
      const { hasBeenReportedToChildProtectiveServices } =
        getApplicationAnswers(answers)

      return (
        hasBehaviorSchoolOrDepartmentSubType(answers, externalData) &&
        hasBeenReportedToChildProtectiveServices === YES
      )
    },
  }),
]
