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
import { shouldShowSpecialists } from '../../../../utils/conditionUtils'
import { OptionsType } from '../../../../utils/constants'

export const otherSpecialists = [
  buildRadioField({
    id: 'specialEducationSupport.hasOtherSpecialists',
    title: differentNeedsMessages.specialEducationSupport.hasOtherSpecialists,
    description:
      differentNeedsMessages.specialEducationSupport
        .hasOtherSpecialistsDescription,
    width: 'half',
    required: true,
    space: 4,
    options: [
      {
        label: sharedMessages.yes,
        dataTestId: 'has-other-specialists',
        value: YES,
      },
      {
        label: sharedMessages.no,
        dataTestId: 'no-has-other-specialists',
        value: NO,
      },
    ],
  }),
  buildDescriptionField({
    id: 'specialEducationSupport.specialists.description',
    title: differentNeedsMessages.specialEducationSupport.atWhichSpecialist,
    titleVariant: 'h4',
    space: 4,
    condition: shouldShowSpecialists,
  }),
  buildCustomField(
    {
      id: 'specialEducationSupport.specialists',
      title: differentNeedsMessages.specialEducationSupport.specialists,
      component: 'FriggOptionsAsyncSelectField',
      condition: shouldShowSpecialists,
    },
    {
      optionsType: OptionsType.PROFESSIONAL,
      placeholder:
        differentNeedsMessages.specialEducationSupport
          .selectAllThatAppliesPlaceholder,
      isMulti: true,
    },
  ),
]
