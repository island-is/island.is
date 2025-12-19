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
import { shouldShowDiagnosticians } from '../../../../utils/conditionUtils'
import { OptionsType } from '../../../../utils/constants'
import { getApplicationAnswers } from '../../../../utils/newPrimarySchoolUtils'

export const confirmedDiagnosis = [
  buildRadioField({
    id: 'specialEducationSupport.hasConfirmedDiagnosis',
    title: differentNeedsMessages.specialEducationSupport.hasConfirmedDiagnosis,
    width: 'half',
    required: true,
    space: 4,
    options: [
      {
        label: sharedMessages.yes,
        dataTestId: 'has-confirmed-diagnosis',
        value: YES,
      },
      {
        label: sharedMessages.no,
        dataTestId: 'no-has-confirmed-diagnosis',
        value: NO,
      },
    ],
  }),
  buildRadioField({
    id: 'specialEducationSupport.isDiagnosisInProgress',
    title: differentNeedsMessages.specialEducationSupport.isDiagnosisInProgress,
    width: 'half',
    required: true,
    space: 4,
    options: [
      {
        label: sharedMessages.yes,
        dataTestId: 'is-diagnosis-in-progress',
        value: YES,
      },
      {
        label: sharedMessages.no,
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
    title: differentNeedsMessages.specialEducationSupport.atWhichDiagnostician,
    titleVariant: 'h4',
    space: 4,
    condition: shouldShowDiagnosticians,
  }),
  buildCustomField(
    {
      id: 'specialEducationSupport.diagnosticians',
      title: differentNeedsMessages.specialEducationSupport.diagnostician,
      component: 'FriggOptionsAsyncSelectField',
      condition: shouldShowDiagnosticians,
    },
    {
      optionsType: OptionsType.DIAGNOSIS_SPECIALIST,
      placeholder:
        differentNeedsMessages.specialEducationSupport
          .selectAllThatAppliesPlaceholder,
      isMulti: true,
    },
  ),
]
