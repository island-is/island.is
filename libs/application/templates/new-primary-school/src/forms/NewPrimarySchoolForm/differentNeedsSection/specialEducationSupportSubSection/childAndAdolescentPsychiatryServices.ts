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
import {
  hasBehaviorSchoolOrDepartmentSubType,
  shouldShowChildAndAdolescentPsychiatryDepartment,
  shouldShowChildAndAdolescentPsychiatryServicesReceived,
} from '../../../../utils/conditionUtils'
import { OptionsType } from '../../../../utils/constants'
import { getApplicationAnswers } from '../../../../utils/newPrimarySchoolUtils'

export const childAndAdolescentPsychiatryServices = [
  buildRadioField({
    id: 'specialEducationSupport.hasReceivedChildAndAdolescentPsychiatryServices',
    title:
      differentNeedsMessages.specialEducationSupport
        .hasReceivedChildAndAdolescentPsychiatryServices,
    width: 'half',
    required: true,
    space: 4,
    options: [
      {
        label: sharedMessages.yes,
        dataTestId: 'has-received-child-and-adolescent-psychiatry-services',
        value: YES,
      },
      {
        label: sharedMessages.no,
        dataTestId: 'no-has-received-child-and-adolescent-psychiatry-services',
        value: NO,
      },
    ],
    condition: hasBehaviorSchoolOrDepartmentSubType,
  }),
  buildRadioField({
    id: 'specialEducationSupport.isOnWaitlistForServices',
    title:
      differentNeedsMessages.specialEducationSupport.isOnWaitlistForServices,
    width: 'half',
    required: true,
    space: 4,
    options: [
      {
        label: sharedMessages.yes,
        dataTestId: 'is-on-waitlist-for-services',
        value: YES,
      },
      {
        label: sharedMessages.no,
        dataTestId: 'no-is-on-waitlist-for-services',
        value: NO,
      },
    ],
    condition: (answers, externalData) => {
      const { hasReceivedChildAndAdolescentPsychiatryServices } =
        getApplicationAnswers(answers)

      return (
        hasBehaviorSchoolOrDepartmentSubType(answers, externalData) &&
        hasReceivedChildAndAdolescentPsychiatryServices === NO
      )
    },
  }),
  buildDescriptionField({
    id: 'specialEducationSupport.childAndAdolescentPsychiatryDepartment.description',
    title:
      differentNeedsMessages.specialEducationSupport
        .whichChildAndAdolescentPsychiatryDepartment,
    titleVariant: 'h4',
    space: 4,
    condition: shouldShowChildAndAdolescentPsychiatryDepartment,
  }),
  buildCustomField(
    {
      id: 'specialEducationSupport.childAndAdolescentPsychiatryDepartment',
      title:
        differentNeedsMessages.specialEducationSupport
          .childAndAdolescentPsychiatryDepartment,
      component: 'FriggOptionsAsyncSelectField',
      condition: shouldShowChildAndAdolescentPsychiatryDepartment,
    },
    {
      optionsType: OptionsType.CHILD_AND_ADOLESCENT_MENTAL_HEALTH_DEPARTMENT,
      placeholder:
        differentNeedsMessages.specialEducationSupport
          .selectWhatIsAppropriatePlaceholder,
    },
  ),
  buildDescriptionField({
    id: 'specialEducationSupport.childAndAdolescentPsychiatryServicesReceived.description',
    title:
      differentNeedsMessages.specialEducationSupport
        .childAndAdolescentPsychiatryServicesReceived,
    titleVariant: 'h4',
    space: 4,
    condition: shouldShowChildAndAdolescentPsychiatryServicesReceived,
  }),
  buildCustomField(
    {
      id: 'specialEducationSupport.childAndAdolescentPsychiatryServicesReceived',
      title: differentNeedsMessages.specialEducationSupport.service,
      component: 'FriggOptionsAsyncSelectField',
      condition: shouldShowChildAndAdolescentPsychiatryServicesReceived,
    },
    {
      optionsType: OptionsType.CHILD_AND_ADOLESCENT_MENTAL_HEALTH_SERVICE,
      placeholder:
        differentNeedsMessages.specialEducationSupport
          .selectAllThatAppliesPlaceholder,
      isMulti: true,
    },
  ),
]
