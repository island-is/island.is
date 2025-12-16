import {
  buildCustomField,
  buildDescriptionField,
  buildRadioField,
  NO,
  YES,
} from '@island.is/application/core'
import { newPrimarySchoolMessages } from '../../../../lib/messages'
import { shouldShowSupportNeedsAssessmentBy } from '../../../../utils/conditionUtils'
import { OptionsType } from '../../../../utils/constants'
import { getApplicationAnswers } from '../../../../utils/newPrimarySchoolUtils'

export const assessmentOfSupportNeeds = [
  buildRadioField({
    id: 'specialEducationSupport.hasAssessmentOfSupportNeeds',
    title: newPrimarySchoolMessages.differentNeeds.hasAssessmentOfSupportNeeds,
    description:
      newPrimarySchoolMessages.differentNeeds
        .hasAssessmentOfSupportNeedsDescription,
    width: 'half',
    required: true,
    space: 4,
    options: [
      {
        label: newPrimarySchoolMessages.shared.yes,
        dataTestId: 'has-assessment-of-support-needs',
        value: YES,
      },
      {
        label: newPrimarySchoolMessages.shared.no,
        dataTestId: 'no-has-assessment-of-support-needs',
        value: NO,
      },
    ],
  }),
  buildRadioField({
    id: 'specialEducationSupport.isAssessmentOfSupportNeedsInProgress',
    title:
      newPrimarySchoolMessages.differentNeeds
        .isAssessmentOfSupportNeedsInProgress,
    width: 'half',
    required: true,
    space: 4,
    options: [
      {
        label: newPrimarySchoolMessages.shared.yes,
        dataTestId: 'is-assessment-of-support-needs-in-progress',
        value: YES,
      },
      {
        label: newPrimarySchoolMessages.shared.no,
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
    title: newPrimarySchoolMessages.differentNeeds.supportNeedsAssessmentBy,
    titleVariant: 'h4',
    space: 4,
    condition: shouldShowSupportNeedsAssessmentBy,
  }),
  buildCustomField(
    {
      id: 'specialEducationSupport.supportNeedsAssessmentBy',
      title: newPrimarySchoolMessages.differentNeeds.evaluationProvider,
      component: 'FriggOptionsAsyncSelectField',
      condition: shouldShowSupportNeedsAssessmentBy,
    },
    {
      optionsType: OptionsType.ASSESSOR,
      placeholder:
        newPrimarySchoolMessages.differentNeeds
          .selectWhatIsAppropriatePlaceholder,
    },
  ),
]
