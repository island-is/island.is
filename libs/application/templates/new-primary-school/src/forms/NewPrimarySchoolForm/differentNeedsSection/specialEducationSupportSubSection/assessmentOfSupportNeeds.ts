import {
  buildCustomField,
  buildDescriptionField,
  buildRadioField,
  NO,
  YES,
} from '@island.is/application/core'
import {
  differentNeedsMessages,
  sharedMessages,
} from '../../../../lib/messages'
import { shouldShowSupportNeedsAssessmentBy } from '../../../../utils/conditionUtils'
import { OptionsType } from '../../../../utils/constants'
import { getApplicationAnswers } from '../../../../utils/newPrimarySchoolUtils'

export const assessmentOfSupportNeeds = [
  buildRadioField({
    id: 'specialEducationSupport.hasAssessmentOfSupportNeeds',
    title:
      differentNeedsMessages.specialEducationSupport
        .hasAssessmentOfSupportNeeds,
    description:
      differentNeedsMessages.specialEducationSupport
        .hasAssessmentOfSupportNeedsDescription,
    width: 'half',
    required: true,
    space: 4,
    options: [
      {
        label: sharedMessages.yes,
        dataTestId: 'has-assessment-of-support-needs',
        value: YES,
      },
      {
        label: sharedMessages.no,
        dataTestId: 'no-has-assessment-of-support-needs',
        value: NO,
      },
    ],
  }),
  buildRadioField({
    id: 'specialEducationSupport.isAssessmentOfSupportNeedsInProgress',
    title:
      differentNeedsMessages.specialEducationSupport
        .isAssessmentOfSupportNeedsInProgress,
    width: 'half',
    required: true,
    space: 4,
    options: [
      {
        label: sharedMessages.yes,
        dataTestId: 'is-assessment-of-support-needs-in-progress',
        value: YES,
      },
      {
        label: sharedMessages.no,
        dataTestId: 'no-is-assessment-of-support-needs-in-progress',
        value: NO,
      },
    ],
    condition: (answers) => {
      const { hasAssessmentOfSupportNeeds } = getApplicationAnswers(answers)

      return hasAssessmentOfSupportNeeds === NO
    },
  }),
  buildDescriptionField({
    id: 'specialEducationSupport.supportNeedsAssessmentBy.description',
    title:
      differentNeedsMessages.specialEducationSupport.supportNeedsAssessmentBy,
    titleVariant: 'h4',
    space: 4,
    condition: shouldShowSupportNeedsAssessmentBy,
  }),
  buildCustomField(
    {
      id: 'specialEducationSupport.supportNeedsAssessmentBy',
      title: differentNeedsMessages.specialEducationSupport.evaluationProvider,
      component: 'FriggOptionsAsyncSelectField',
      condition: shouldShowSupportNeedsAssessmentBy,
    },
    {
      optionsType: OptionsType.ASSESSOR,
      placeholder:
        differentNeedsMessages.specialEducationSupport
          .selectWhatIsAppropriatePlaceholder,
    },
  ),
]
