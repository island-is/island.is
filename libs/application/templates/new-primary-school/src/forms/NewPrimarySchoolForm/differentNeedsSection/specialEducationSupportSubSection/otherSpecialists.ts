import {
  buildCustomField,
  buildDescriptionField,
  buildRadioField,
  NO,
  YES,
} from '@island.is/application/core'
import { newPrimarySchoolMessages } from '../../../../lib/messages'
import { shouldShowSpecialists } from '../../../../utils/conditionUtils'
import { OptionsType } from '../../../../utils/constants'

export const otherSpecialists = [
  buildRadioField({
    id: 'specialEducationSupport.hasOtherSpecialists',
    title: newPrimarySchoolMessages.differentNeeds.hasOtherSpecialists,
    description:
      newPrimarySchoolMessages.differentNeeds.hasOtherSpecialistsDescription,
    width: 'half',
    required: true,
    space: 4,
    options: [
      {
        label: newPrimarySchoolMessages.shared.yes,
        dataTestId: 'has-other-specialists',
        value: YES,
      },
      {
        label: newPrimarySchoolMessages.shared.no,
        dataTestId: 'no-has-other-specialists',
        value: NO,
      },
    ],
  }),
  buildDescriptionField({
    id: 'specialEducationSupport.specialists.description',
    title: newPrimarySchoolMessages.differentNeeds.atWhichSpecialist,
    titleVariant: 'h4',
    space: 4,
    condition: shouldShowSpecialists,
  }),
  buildCustomField(
    {
      id: 'specialEducationSupport.specialists',
      title: newPrimarySchoolMessages.differentNeeds.specialists,
      component: 'FriggOptionsAsyncSelectField',
      condition: shouldShowSpecialists,
    },
    {
      optionsType: OptionsType.PROFESSIONAL,
      placeholder:
        newPrimarySchoolMessages.differentNeeds.selectAllThatAppliesPlaceholder,
      isMulti: true,
    },
  ),
]
