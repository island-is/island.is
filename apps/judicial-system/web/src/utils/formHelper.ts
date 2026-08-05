import { SetStateAction } from 'react'
import compareAsc from 'date-fns/compareAsc'

import {
  CASE_TABLE_GROUPS_ROUTE,
  COURT_OF_APPEAL_CASE_ROUTE,
  COURT_OF_APPEAL_OVERVIEW_ROUTE,
  COURT_OF_APPEAL_RESULT_ROUTE,
  COURT_OF_APPEAL_RULING_ROUTE,
  COURT_OF_APPEAL_SUMMARY_ROUTE,
  DISTRICT_COURT_INDICTMENT_CASE_CONCLUSION_ROUTE,
  DISTRICT_COURT_INDICTMENT_CASE_COURT_OVERVIEW_ROUTE,
  DISTRICT_COURT_INDICTMENT_CASE_COURT_RECORD_ROUTE,
  DISTRICT_COURT_INDICTMENT_CASE_DEFENDER_ROUTE,
  DISTRICT_COURT_INDICTMENT_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
  DISTRICT_COURT_INDICTMENT_CASE_SUBPOENA_ROUTE,
  DISTRICT_COURT_INDICTMENT_CASE_SUMMARY_ROUTE,
  DISTRICT_COURT_INVESTIGATION_CASE_CONFIRMATION_ROUTE,
  DISTRICT_COURT_INVESTIGATION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE,
  DISTRICT_COURT_INVESTIGATION_CASE_COURT_RECORD_ROUTE,
  DISTRICT_COURT_INVESTIGATION_CASE_OVERVIEW_ROUTE,
  DISTRICT_COURT_INVESTIGATION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
  DISTRICT_COURT_INVESTIGATION_CASE_RULING_ROUTE,
  DISTRICT_COURT_RESTRICTION_CASE_CONFIRMATION_ROUTE,
  DISTRICT_COURT_RESTRICTION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE,
  DISTRICT_COURT_RESTRICTION_CASE_COURT_OVERVIEW_ROUTE,
  DISTRICT_COURT_RESTRICTION_CASE_COURT_RECORD_ROUTE,
  DISTRICT_COURT_RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
  DISTRICT_COURT_RESTRICTION_CASE_RULING_ROUTE,
  PROSECUTION_CREATE_CUSTODY_CASE_ROUTE,
  PROSECUTION_CREATE_INVESTIGATION_CASE_ROUTE,
  PROSECUTION_CREATE_TRAVEL_BAN_ROUTE,
  PROSECUTION_INDICTMENT_CASE_CASE_FILE_ROUTE,
  PROSECUTION_INDICTMENT_CASE_CASE_FILES_ROUTE,
  PROSECUTION_INDICTMENT_CASE_CONFIRMING_ROUTE,
  PROSECUTION_INDICTMENT_CASE_DEFENDANT_ROUTE,
  PROSECUTION_INDICTMENT_CASE_INDICTMENT_ROUTE,
  PROSECUTION_INDICTMENT_CASE_POLICE_CASE_FILES_ROUTE,
  PROSECUTION_INDICTMENT_CASE_PROCESSING_ROUTE,
  PROSECUTION_INVESTIGATION_CASE_CASE_FILES_ROUTE,
  PROSECUTION_INVESTIGATION_CASE_DEFENDANT_ROUTE,
  PROSECUTION_INVESTIGATION_CASE_HEARING_ARRANGEMENTS_ROUTE,
  PROSECUTION_INVESTIGATION_CASE_POLICE_CONFIRMATION_ROUTE,
  PROSECUTION_INVESTIGATION_CASE_POLICE_DEMANDS_ROUTE,
  PROSECUTION_INVESTIGATION_CASE_POLICE_REPORT_ROUTE,
  PROSECUTION_INVESTIGATION_CASE_REGISTRATION_ROUTE,
  PROSECUTION_RESTRICTION_CASE_CASE_FILES_ROUTE,
  PROSECUTION_RESTRICTION_CASE_DEFENDANT_ROUTE,
  PROSECUTION_RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE,
  PROSECUTION_RESTRICTION_CASE_OVERVIEW_ROUTE,
  PROSECUTION_RESTRICTION_CASE_POLICE_DEMANDS_ROUTE,
  PROSECUTION_RESTRICTION_CASE_POLICE_REPORT_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  AppealCase,
  Case,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { replaceTabs } from './formatters'
import { UpdateCase } from './hooks'
import * as validations from './validate'

export const applyUpdateToCase = (
  prevWorkingCase: Case,
  updates: Partial<UpdateCase>,
): Case => {
  return {
    ...prevWorkingCase,
    ...updates,
  }
}

export const removeTabsValidateAndSet = (
  field: keyof UpdateCase,
  value: string,
  validations: validations.Validation[],
  setWorkingCase: (value: SetStateAction<Case>) => void,
  errorMessage?: string,
  setErrorMessage?: (value: SetStateAction<string>) => void,
) => {
  if (value.includes('\t')) {
    value = replaceTabs(value)
  }

  validateAndSet(
    field,
    value,
    validations,
    setWorkingCase,
    errorMessage,
    setErrorMessage,
  )
}

export const removeErrorMessageIfValid = (
  validationsToRun: validations.Validation[],
  value: string,
  errorMessage?: string,
  errorMessageSetter?: (value: SetStateAction<string>) => void,
) => {
  const isValid = validations.validate([[value, validationsToRun]]).isValid

  if (errorMessage !== '' && errorMessageSetter && isValid) {
    errorMessageSetter('')
  }
}

export const validateAndSetErrorMessage = (
  validationsToRun: validations.Validation[],
  value: string,
  errorMessageSetter?: (value: SetStateAction<string>) => void,
) => {
  const validation = validations.validate([[value, validationsToRun]])

  if (errorMessageSetter) {
    errorMessageSetter(validation.errorMessage)
  }

  return validation.isValid
}

export const validateAndSet = (
  field: keyof UpdateCase,
  value: string,
  validations: validations.Validation[],
  setWorkingCase: (value: SetStateAction<Case>) => void,
  errorMessage?: string,
  setErrorMessage?: (value: SetStateAction<string>) => void,
) => {
  removeErrorMessageIfValid(validations, value, errorMessage, setErrorMessage)

  setWorkingCase((prevWorkingCase) =>
    applyUpdateToCase(prevWorkingCase, { [field]: value }),
  )
}

export const validateAndSendToServer = (
  field: keyof UpdateCase,
  value: string,
  validations: validations.Validation[],
  theCase: Case,
  updateCase: (id: string, updateCase: UpdateCase) => void,
  setErrorMessage?: (value: SetStateAction<string>) => void,
) => {
  const isValid = validateAndSetErrorMessage(
    validations,
    value,
    setErrorMessage,
  )

  if (theCase.id !== '' && isValid) {
    updateCase(theCase.id, { [field]: value })
  }
}

/**If entry is included in values then it is removed
 * otherwise it is appended
 */
export const toggleInArray = <T>(values: T[] | undefined | null, entry: T) => {
  if (!values) return [entry]

  return values.includes(entry)
    ? values.filter((x) => x !== entry)
    : [...values, entry]
}

export const setCheckboxAndSendToServer = (
  field: keyof UpdateCase,
  value: string,
  theCase: Case,
  setWorkingCase: (value: SetStateAction<Case>) => void,
  updateCase: (id: string, updateCase: UpdateCase) => void,
) => {
  const currentValue = theCase[field as keyof Case]

  const checks = currentValue ? [...(currentValue as [])] : ([] as string[])

  if (!checks.includes(value)) {
    checks.push(value)
  } else {
    checks.splice(checks.indexOf(value), 1)
  }

  setWorkingCase((prevWorkingCase) =>
    applyUpdateToCase(prevWorkingCase, { [field]: checks }),
  )

  if (theCase.id !== '') {
    updateCase(theCase.id, { [field]: checks })
  }
}

export const hasDateChanged = (
  currentDate: string | null | undefined,
  newDate: Date | undefined,
) => {
  if (!currentDate && newDate) return true

  if (currentDate && newDate) {
    return compareAsc(newDate, new Date(currentDate)) !== 0
  }
  return false
}

export type stepValidationsType = {
  [CASE_TABLE_GROUPS_ROUTE]: () => boolean
  [PROSECUTION_CREATE_CUSTODY_CASE_ROUTE]: (theCase: Case) => boolean
  [PROSECUTION_CREATE_TRAVEL_BAN_ROUTE]: (theCase: Case) => boolean
  [PROSECUTION_RESTRICTION_CASE_DEFENDANT_ROUTE]: (theCase: Case) => boolean
  [PROSECUTION_RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE]: (
    theCase: Case,
  ) => boolean
  [PROSECUTION_RESTRICTION_CASE_POLICE_DEMANDS_ROUTE]: (
    theCase: Case,
  ) => boolean
  [PROSECUTION_RESTRICTION_CASE_POLICE_REPORT_ROUTE]: (theCase: Case) => boolean
  [PROSECUTION_RESTRICTION_CASE_CASE_FILES_ROUTE]: () => boolean
  [PROSECUTION_RESTRICTION_CASE_OVERVIEW_ROUTE]: () => boolean
  [PROSECUTION_CREATE_INVESTIGATION_CASE_ROUTE]: (theCase: Case) => boolean
  [PROSECUTION_INVESTIGATION_CASE_REGISTRATION_ROUTE]: (
    theCase: Case,
  ) => boolean
  [PROSECUTION_INVESTIGATION_CASE_DEFENDANT_ROUTE]: (theCase: Case) => boolean
  [PROSECUTION_INVESTIGATION_CASE_HEARING_ARRANGEMENTS_ROUTE]: (
    theCase: Case,
  ) => boolean
  [PROSECUTION_INVESTIGATION_CASE_POLICE_DEMANDS_ROUTE]: (
    theCase: Case,
  ) => boolean
  [PROSECUTION_INVESTIGATION_CASE_POLICE_REPORT_ROUTE]: (
    theCase: Case,
  ) => boolean
  [PROSECUTION_INVESTIGATION_CASE_CASE_FILES_ROUTE]: () => boolean
  [PROSECUTION_INDICTMENT_CASE_DEFENDANT_ROUTE]: (theCase: Case) => boolean
  [PROSECUTION_INDICTMENT_CASE_POLICE_CASE_FILES_ROUTE]: () => boolean
  [PROSECUTION_INVESTIGATION_CASE_POLICE_CONFIRMATION_ROUTE]: () => boolean
  [PROSECUTION_INDICTMENT_CASE_CASE_FILE_ROUTE]: () => boolean
  [PROSECUTION_INDICTMENT_CASE_CASE_FILES_ROUTE]: (theCase: Case) => boolean
  [PROSECUTION_INDICTMENT_CASE_PROCESSING_ROUTE]: (theCase: Case) => boolean
  [PROSECUTION_INDICTMENT_CASE_INDICTMENT_ROUTE]: (theCase: Case) => boolean
  [DISTRICT_COURT_RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE]: (
    theCase: Case,
  ) => boolean
  [DISTRICT_COURT_RESTRICTION_CASE_COURT_OVERVIEW_ROUTE]: () => boolean
  [DISTRICT_COURT_RESTRICTION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE]: (
    theCase: Case,
  ) => boolean
  [DISTRICT_COURT_RESTRICTION_CASE_RULING_ROUTE]: (theCase: Case) => boolean
  [DISTRICT_COURT_RESTRICTION_CASE_COURT_RECORD_ROUTE]: (
    theCase: Case,
  ) => boolean
  [DISTRICT_COURT_RESTRICTION_CASE_CONFIRMATION_ROUTE]: () => boolean
  [DISTRICT_COURT_INVESTIGATION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE]: (
    theCase: Case,
  ) => boolean
  [DISTRICT_COURT_INVESTIGATION_CASE_OVERVIEW_ROUTE]: () => boolean
  [DISTRICT_COURT_INVESTIGATION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE]: (
    theCase: Case,
  ) => boolean
  [DISTRICT_COURT_INVESTIGATION_CASE_RULING_ROUTE]: (theCase: Case) => boolean
  [DISTRICT_COURT_INVESTIGATION_CASE_COURT_RECORD_ROUTE]: (
    theCase: Case,
  ) => boolean
  [DISTRICT_COURT_INVESTIGATION_CASE_CONFIRMATION_ROUTE]: () => boolean
  [PROSECUTION_INDICTMENT_CASE_CONFIRMING_ROUTE]: () => boolean
  [DISTRICT_COURT_INDICTMENT_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE]: (
    theCase: Case,
  ) => boolean
  [DISTRICT_COURT_INDICTMENT_CASE_SUBPOENA_ROUTE]: (theCase: Case) => boolean
  [DISTRICT_COURT_INDICTMENT_CASE_DEFENDER_ROUTE]: (theCase: Case) => boolean
  [DISTRICT_COURT_INDICTMENT_CASE_COURT_RECORD_ROUTE]: () => boolean
  [DISTRICT_COURT_INDICTMENT_CASE_CONCLUSION_ROUTE]: (theCase: Case) => boolean
  [DISTRICT_COURT_INDICTMENT_CASE_COURT_OVERVIEW_ROUTE]: () => boolean
  [DISTRICT_COURT_INDICTMENT_CASE_SUMMARY_ROUTE]: () => boolean
  [COURT_OF_APPEAL_OVERVIEW_ROUTE]: () => boolean
  [COURT_OF_APPEAL_CASE_ROUTE]: (theCase: Case) => boolean
  [COURT_OF_APPEAL_RULING_ROUTE]: (theCase: Case) => boolean
  [COURT_OF_APPEAL_SUMMARY_ROUTE]: (theCase: Case) => boolean
  [COURT_OF_APPEAL_RESULT_ROUTE]: () => boolean
}

// COA step validations operate on the appeal-case row identified by the
// `?appealCaseId=…` URL query. Callers (currently `useSections`)
// resolve the target appeal and pass it in; non-COA callers can pass
// `theCase.appealCase` or omit the argument — the default is `undefined`,
// which causes the COA validators to fail-closed (acceptable since non-COA
// users never traverse those routes).
export const stepValidations = (
  appealCase?: AppealCase | null,
): stepValidationsType => {
  return {
    [CASE_TABLE_GROUPS_ROUTE]: () => true,
    [PROSECUTION_CREATE_CUSTODY_CASE_ROUTE]: (theCase: Case) =>
      validations.isDefendantStepValidRC(theCase, theCase.policeCaseNumbers),
    [PROSECUTION_CREATE_TRAVEL_BAN_ROUTE]: (theCase: Case) =>
      validations.isDefendantStepValidRC(theCase, theCase.policeCaseNumbers),
    [PROSECUTION_RESTRICTION_CASE_DEFENDANT_ROUTE]: (theCase: Case) =>
      validations.isDefendantStepValidRC(theCase, theCase.policeCaseNumbers),
    [PROSECUTION_RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE]: (
      theCase: Case,
    ) => validations.isHearingArrangementsStepValidRC(theCase),
    [PROSECUTION_RESTRICTION_CASE_POLICE_DEMANDS_ROUTE]: (theCase: Case) =>
      validations.isPoliceDemandsStepValidRC(theCase),
    [PROSECUTION_RESTRICTION_CASE_POLICE_REPORT_ROUTE]: (theCase: Case) =>
      validations.isPoliceReportStepValidRC(theCase),
    [PROSECUTION_RESTRICTION_CASE_CASE_FILES_ROUTE]: () => true,
    [PROSECUTION_RESTRICTION_CASE_OVERVIEW_ROUTE]: () => true,
    [PROSECUTION_CREATE_INVESTIGATION_CASE_ROUTE]: (theCase: Case) =>
      validations.isDefendantStepValidIC(theCase),
    [PROSECUTION_INVESTIGATION_CASE_REGISTRATION_ROUTE]: (theCase: Case) =>
      validations.isRegistrationStepValid(
        theCase,
        theCase.type,
        theCase.policeCaseNumbers,
      ),
    [PROSECUTION_INVESTIGATION_CASE_DEFENDANT_ROUTE]: (theCase: Case) =>
      validations.isDefendantStepValidIC(theCase),
    [PROSECUTION_INVESTIGATION_CASE_HEARING_ARRANGEMENTS_ROUTE]: (
      theCase: Case,
    ) => validations.isHearingArrangementsStepValidIC(theCase),
    [PROSECUTION_INVESTIGATION_CASE_POLICE_DEMANDS_ROUTE]: (theCase: Case) =>
      validations.isPoliceDemandsStepValidIC(theCase),
    [PROSECUTION_INVESTIGATION_CASE_POLICE_REPORT_ROUTE]: (theCase: Case) =>
      validations.isPoliceReportStepValidIC(theCase),
    [PROSECUTION_INVESTIGATION_CASE_CASE_FILES_ROUTE]: () => true,
    [PROSECUTION_INVESTIGATION_CASE_POLICE_CONFIRMATION_ROUTE]: () => true,
    [PROSECUTION_INDICTMENT_CASE_DEFENDANT_ROUTE]: (theCase: Case) =>
      validations.isDefendantStepValidIndictments(theCase),
    [PROSECUTION_INDICTMENT_CASE_POLICE_CASE_FILES_ROUTE]: () => true,
    [PROSECUTION_INDICTMENT_CASE_CASE_FILE_ROUTE]: () => true,
    [PROSECUTION_INDICTMENT_CASE_CASE_FILES_ROUTE]: () => true,
    [PROSECUTION_INDICTMENT_CASE_PROCESSING_ROUTE]: (theCase: Case) =>
      validations.isProcessingStepValidIndictments(theCase),
    [PROSECUTION_INDICTMENT_CASE_INDICTMENT_ROUTE]: (theCase: Case) =>
      validations.isIndictmentStepValid(theCase),
    [DISTRICT_COURT_INDICTMENT_CASE_SUMMARY_ROUTE]: () => true,
    [DISTRICT_COURT_RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE]: (
      theCase: Case,
    ) => validations.isReceptionAndAssignmentStepValid(theCase),
    [DISTRICT_COURT_RESTRICTION_CASE_COURT_OVERVIEW_ROUTE]: () => true,
    [DISTRICT_COURT_RESTRICTION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE]: (
      theCase: Case,
    ) => validations.isCourtHearingArrangemenstStepValidRC(theCase),
    [DISTRICT_COURT_RESTRICTION_CASE_RULING_ROUTE]: (theCase: Case) =>
      validations.isRulingValidRC(theCase),
    [DISTRICT_COURT_RESTRICTION_CASE_COURT_RECORD_ROUTE]: (theCase: Case) =>
      validations.isCourtRecordStepValidRC(theCase),
    [DISTRICT_COURT_RESTRICTION_CASE_CONFIRMATION_ROUTE]: () => true,
    [DISTRICT_COURT_INVESTIGATION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE]: (
      theCase: Case,
    ) => validations.isReceptionAndAssignmentStepValid(theCase),
    [DISTRICT_COURT_INVESTIGATION_CASE_OVERVIEW_ROUTE]: () => true,
    [DISTRICT_COURT_INVESTIGATION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE]: (
      theCase: Case,
    ) => validations.isCourtHearingArrangementsStepValidIC(theCase),
    [DISTRICT_COURT_INVESTIGATION_CASE_RULING_ROUTE]: (theCase: Case) =>
      validations.isRulingValidIC(theCase),
    [DISTRICT_COURT_INVESTIGATION_CASE_COURT_RECORD_ROUTE]: (theCase: Case) =>
      validations.isCourtRecordStepValidIC(theCase),
    [DISTRICT_COURT_INVESTIGATION_CASE_CONFIRMATION_ROUTE]: () => true,
    [PROSECUTION_INDICTMENT_CASE_CONFIRMING_ROUTE]: () => true,
    [DISTRICT_COURT_INDICTMENT_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE]: (
      theCase: Case,
    ) => validations.isReceptionAndAssignmentStepValid(theCase),
    [DISTRICT_COURT_INDICTMENT_CASE_SUBPOENA_ROUTE]: (theCase: Case) =>
      validations.isSubpoenaStepValid(theCase),
    [DISTRICT_COURT_INDICTMENT_CASE_DEFENDER_ROUTE]: (theCase: Case) =>
      validations.isDefenderStepValid(theCase),
    [DISTRICT_COURT_INDICTMENT_CASE_COURT_RECORD_ROUTE]: () => true,
    [DISTRICT_COURT_INDICTMENT_CASE_CONCLUSION_ROUTE]: (theCase: Case) =>
      validations.isConclusionStepValid(theCase),
    [DISTRICT_COURT_INDICTMENT_CASE_COURT_OVERVIEW_ROUTE]: () => true,
    [COURT_OF_APPEAL_OVERVIEW_ROUTE]: () => true,
    [COURT_OF_APPEAL_CASE_ROUTE]: () =>
      validations.isCourtOfAppealCaseStepValid(appealCase),
    [COURT_OF_APPEAL_RULING_ROUTE]: (theCase: Case) =>
      validations.isCourtOfAppealRulingStepValid(theCase, appealCase),
    [COURT_OF_APPEAL_SUMMARY_ROUTE]: () =>
      appealCase?.appealState === 'COMPLETED',
    [COURT_OF_APPEAL_RESULT_ROUTE]: () => true,
  }
}

export const findFirstInvalidStep = (
  steps: string[],
  theCase: Case,
  appealCase?: AppealCase | null,
) => {
  const validations = stepValidations(appealCase ?? theCase.appealCase)
  const validationFunctions = Object.entries(validations)
  const stepsToCheck = validationFunctions.filter(([key]) =>
    steps.includes(key),
  )

  if (stepsToCheck.every(([, validationFn]) => validationFn(theCase))) {
    return steps[steps.length - 1]
  }

  const [key] =
    stepsToCheck.find(([, validationFn]) => !validationFn(theCase)) ?? []

  return key
}
