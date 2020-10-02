import {
  AppealDecision,
  AppealDecitionRole,
  Case,
  CustodyRestrictions,
} from '../types'
import * as api from '../api'
import { formatDate, parseString } from './formatters'

export const updateState = (
  state: Case,
  fieldToUpdate: string,
  fieldValue: string | string[] | Date | boolean,
  stateSetter: (state: Case) => void,
) => {
  // Create a copy of the state
  const copyOfState = Object.assign({}, state)

  // Update the copy of the state
  copyOfState[fieldToUpdate] = fieldValue

  // Set the copy of the state as the state
  stateSetter(copyOfState)

  window.localStorage.setItem('workingCase', JSON.stringify(copyOfState))
}

export const autoSave = async (
  state: Case,
  caseField: string,
  caseFieldValue: string | Date | boolean,
  stateSetter: (state: Case) => void,
) => {
  // Only save if the field has changes and the case exists
  if (state[caseField] !== caseFieldValue && state.id !== '') {
    // Parse the property change
    const propertyChange = parseString(caseField, caseFieldValue)

    // Save the case
    const response = await api.saveCase(state.id, propertyChange)

    if (response === 200) {
      // Update the working case
      updateState(state, caseField, caseFieldValue, stateSetter)
    } else {
      // TODO: Do something when autosave fails
    }
  }
}

export const getRestrictionByValue = (value: CustodyRestrictions) => {
  switch (value) {
    case CustodyRestrictions.COMMUNICATION:
      return 'D - Bréfskoðun, símabann'
    case CustodyRestrictions.ISOLATION:
      return 'B - Einangrun'
    case CustodyRestrictions.MEDIA:
      return 'E - Fjölmiðlabann'
    case CustodyRestrictions.VISITAION:
      return 'C - Heimsóknarbann'
  }
}

export const renderRestrictons = (restrictions: CustodyRestrictions[]) => {
  return restrictions && restrictions.length > 0
    ? restrictions
        .map((restriction) => getRestrictionByValue(restriction))
        .toString()
        .replace(',', ', ')
    : 'Lausagæsla'
}

export const getAppealDecitionText = (
  role: AppealDecitionRole,
  appealDecition: AppealDecision,
) => {
  switch (appealDecition) {
    case AppealDecision.APPEAL: {
      return `${
        role === AppealDecitionRole.ACCUSED ? 'Kærði' : 'Sækjandi'
      } kærir málið`
    }
    case AppealDecision.ACCEPT: {
      return `${
        role === AppealDecitionRole.ACCUSED ? 'Kærði' : 'Sækjandi'
      } unir úrskurðinum`
    }
    case AppealDecision.POSTPONE: {
      return `${
        role === AppealDecitionRole.ACCUSED ? 'Kærði' : 'Sækjandi'
      } tekur sér lögboðinn frest`
    }
  }
}

export const constructConclusion = (workingCase: Case) => {
  return workingCase.rejecting
    ? 'Beiðni um gæsluvarðhald hafnað'
    : `Kærði, ${workingCase.accusedName} kt.${
        workingCase.accusedNationalId
      } skal sæta gæsluvarðhaldi, þó ekki lengur en til ${formatDate(
        workingCase.custodyEndDate,
        'PPPp',
      )}. ${
        workingCase.custodyRestrictions?.length === 0
          ? 'Engar takmarkanir skulu vera á gæslunni.'
          : `Kærði skal sæta ${workingCase.custodyRestrictions?.map(
              (custodyRestriction, index) => {
                const isNextLast =
                  index === workingCase.custodyRestrictions.length - 1

                return custodyRestriction === CustodyRestrictions.ISOLATION
                  ? `einangrun${isNextLast && ' og '}`
                  : custodyRestriction === CustodyRestrictions.COMMUNICATION
                  ? `bréfa, og símabanni${isNextLast && ' og '}`
                  : custodyRestriction === CustodyRestrictions.MEDIA
                  ? `fjölmiðlabanni${isNextLast && ' og '}`
                  : custodyRestriction === CustodyRestrictions.VISITAION
                  ? `fjölmiðlabanni${isNextLast && ' og '}`
                  : ''
              },
            )} á meðan á gæsluvarðhaldinu stendur.`
      }`
}
