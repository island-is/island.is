import {
  buildCustomField,
  buildDescriptionField,
  buildRadioField,
  NO,
  YES,
} from '@island.is/application/core'
import { newPrimarySchoolMessages } from '../../../../lib/messages'
import { shouldShowDiagnosticians } from '../../../../utils/conditionUtils'
import { OptionsType } from '../../../../utils/constants'
import { getApplicationAnswers } from '../../../../utils/newPrimarySchoolUtils'

export const confirmedDiagnosis = [
  buildRadioField({
    id: 'specialEducationSupport.hasConfirmedDiagnosis',
    title: newPrimarySchoolMessages.differentNeeds.hasConfirmedDiagnosis,
    width: 'half',
    required: true,
    space: 4,
    options: [
      {
        label: newPrimarySchoolMessages.shared.yes,
        dataTestId: 'has-confirmed-diagnosis',
        value: YES,
      },
      {
        label: newPrimarySchoolMessages.shared.no,
        dataTestId: 'no-has-confirmed-diagnosis',
        value: NO,
      },
    ],
  }),
  buildRadioField({
    id: 'specialEducationSupport.isDiagnosisInProgress',
    title: newPrimarySchoolMessages.differentNeeds.isDiagnosisInProgress,
    width: 'half',
    required: true,
    space: 4,
    options: [
      {
        label: newPrimarySchoolMessages.shared.yes,
        dataTestId: 'is-diagnosis-in-progress',
        value: YES,
      },
      {
        label: newPrimarySchoolMessages.shared.no,
        dataTestId: 'no-is-diagnosis-in-progress',
        value: NO,
      },
    ],
    condition: (answers) => {
      const { hasConfirmedDiagnosis } = getApplicationAnswers(answers)

      return hasConfirmedDiagnosis === NO
    },
  }),
  buildDescriptionField({
    id: 'specialEducationSupport.diagnosticians.description',
    title: newPrimarySchoolMessages.differentNeeds.atWhichDiagnostician,
    titleVariant: 'h4',
    space: 4,
    condition: shouldShowDiagnosticians,
  }),
  buildCustomField(
    {
      id: 'specialEducationSupport.diagnosticians',
      title: newPrimarySchoolMessages.differentNeeds.diagnostician,
      component: 'FriggOptionsAsyncSelectField',
      condition: shouldShowDiagnosticians,
    },
    {
      optionsType: OptionsType.DIAGNOSIS_SPECIALIST,
      placeholder:
        newPrimarySchoolMessages.differentNeeds.selectAllThatAppliesPlaceholder,
      isMulti: true,
    },
  ),
]
