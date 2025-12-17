import {
  buildCustomField,
  buildDescriptionField,
  buildRadioField,
  NO,
  YES,
} from '@island.is/application/core'
import { newPrimarySchoolMessages } from '../../../../lib/messages'
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
      newPrimarySchoolMessages.differentNeeds
        .hasReceivedChildAndAdolescentPsychiatryServices,
    width: 'half',
    required: true,
    space: 4,
    options: [
      {
        label: newPrimarySchoolMessages.shared.yes,
        dataTestId: 'has-received-child-and-adolescent-psychiatry-services',
        value: YES,
      },
      {
        label: newPrimarySchoolMessages.shared.no,
        dataTestId: 'no-has-received-child-and-adolescent-psychiatry-services',
        value: NO,
      },
    ],
    condition: hasBehaviorSchoolOrDepartmentSubType,
  }),
  buildRadioField({
    id: 'specialEducationSupport.isOnWaitlistForServices',
    title: newPrimarySchoolMessages.differentNeeds.isOnWaitlistForServices,
    width: 'half',
    required: true,
    space: 4,
    options: [
      {
        label: newPrimarySchoolMessages.shared.yes,
        dataTestId: 'is-on-waitlist-for-services',
        value: YES,
      },
      {
        label: newPrimarySchoolMessages.shared.no,
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
      newPrimarySchoolMessages.differentNeeds
        .whichChildAndAdolescentPsychiatryDepartment,
    titleVariant: 'h4',
    space: 4,
    condition: shouldShowChildAndAdolescentPsychiatryDepartment,
  }),
  buildCustomField(
    {
      id: 'specialEducationSupport.childAndAdolescentPsychiatryDepartment',
      title:
        newPrimarySchoolMessages.differentNeeds
          .childAndAdolescentPsychiatryDepartment,
      component: 'FriggOptionsAsyncSelectField',
      condition: shouldShowChildAndAdolescentPsychiatryDepartment,
    },
    {
      optionsType: OptionsType.CHILD_AND_ADOLESCENT_MENTAL_HEALTH_DEPARTMENT,
      placeholder:
        newPrimarySchoolMessages.differentNeeds
          .selectWhatIsAppropriatePlaceholder,
    },
  ),
  buildDescriptionField({
    id: 'specialEducationSupport.childAndAdolescentPsychiatryServicesReceived.description',
    title:
      newPrimarySchoolMessages.differentNeeds
        .childAndAdolescentPsychiatryServicesReceived,
    titleVariant: 'h4',
    space: 4,
    condition: shouldShowChildAndAdolescentPsychiatryServicesReceived,
  }),
  buildCustomField(
    {
      id: 'specialEducationSupport.childAndAdolescentPsychiatryServicesReceived',
      title: newPrimarySchoolMessages.differentNeeds.service,
      component: 'FriggOptionsAsyncSelectField',
      condition: shouldShowChildAndAdolescentPsychiatryServicesReceived,
    },
    {
      optionsType: OptionsType.CHILD_AND_ADOLESCENT_MENTAL_HEALTH_SERVICE,
      placeholder:
        newPrimarySchoolMessages.differentNeeds.selectAllThatAppliesPlaceholder,
      isMulti: true,
    },
  ),
]
