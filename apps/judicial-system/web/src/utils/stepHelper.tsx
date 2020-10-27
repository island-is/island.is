import React from 'react'
import { AppealDecitionRole, Case, RequiredField } from '../types'
import * as api from '../api'
import { parseString } from './formatters'
import { Text } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  CaseAppealDecision,
  CaseCustodyRestrictions,
} from '@island.is/judicial-system/types'
import { validate } from './validate'

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

  window.sessionStorage.setItem('workingCase', JSON.stringify(copyOfState))
}

/**
 * @deprecated
 *
 * @param state current working case
 * @param caseField field to update
 * @param caseFieldValue value to update
 * @param stateSetter method to set working case
 */
export const autoSave = async (
  state: Case,
  caseField: string,
  caseFieldValue: string | Date | boolean,
  stateSetter: (state: Case) => void,
) => {
  console.warn('Calling AutoSave() is discuraged. Will be removed shortly.')
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

export const getAppealDecitionText = (
  role: AppealDecitionRole,
  appealDecition: CaseAppealDecision,
) => {
  switch (appealDecition) {
    case CaseAppealDecision.APPEAL: {
      return `${
        role === AppealDecitionRole.ACCUSED ? 'Kærði' : 'Sækjandi'
      } kærir málið`
    }
    case CaseAppealDecision.ACCEPT: {
      return `${
        role === AppealDecitionRole.ACCUSED ? 'Kærði' : 'Sækjandi'
      } unir úrskurðinum`
    }
    case CaseAppealDecision.POSTPONE: {
      return `${
        role === AppealDecitionRole.ACCUSED ? 'Kærði' : 'Sækjandi'
      } tekur sér lögboðinn frest`
    }
  }
}

export const constructConclusion = (workingCase: Case) => {
  if (workingCase.rejecting) {
    return (
      <Text as="span" variant="intro">
        Beiðni um gæsluvarðhald hafnað
      </Text>
    )
  } else {
    return (
      <>
        <Text as="span" variant="intro">{`Kærði, `}</Text>
        <Text as="span" variant="intro" color="blue400" fontWeight="semiBold">
          {`${workingCase.accusedName} kt.${workingCase.accusedNationalId} `}
        </Text>
        <Text as="span" variant="intro">
          skal sæta gæsluvarðhaldi, þó ekki lengur en til
        </Text>
        <Text as="span" variant="intro" color="blue400" fontWeight="semiBold">
          {` ${formatDate(workingCase.custodyEndDate, 'PPPp')}. `}
        </Text>
        {workingCase.custodyRestrictions?.length === 0 ? (
          <Text as="span" variant="intro">
            Engar takmarkanir skulu vera á gæslunni.
          </Text>
        ) : (
          <Text as="span" variant="intro">
            Kærði skal sæta
            <Text as="span" color="blue400" fontWeight="semiBold">
              {workingCase.custodyRestrictions?.map(
                (custodyRestriction, index) => {
                  const isNextLast =
                    index === workingCase.custodyRestrictions.length - 2
                  const isLast =
                    index === workingCase.custodyRestrictions.length - 1
                  const isOnly = workingCase.custodyRestrictions.length === 1

                  return custodyRestriction ===
                    CaseCustodyRestrictions.ISOLATION ? (
                    <Text
                      as="span"
                      variant="intro"
                      fontWeight="semiBold"
                      key={index}
                    >
                      {` einangrun${
                        isLast ? '' : isNextLast && !isOnly ? ' og' : ', '
                      }`}
                    </Text>
                  ) : custodyRestriction ===
                    CaseCustodyRestrictions.COMMUNICATION ? (
                    <Text
                      as="span"
                      variant="intro"
                      fontWeight="semiBold"
                      key={index}
                    >
                      {` bréfa, og símabanni${
                        isLast ? '' : isNextLast && !isOnly ? ' og' : ','
                      }`}
                    </Text>
                  ) : custodyRestriction === CaseCustodyRestrictions.MEDIA ? (
                    <Text
                      as="span"
                      variant="intro"
                      fontWeight="semiBold"
                      key={index}
                    >
                      {` fjölmiðlabanni${
                        isLast ? '' : isNextLast && !isOnly ? ' og' : ','
                      }`}
                    </Text>
                  ) : custodyRestriction ===
                    CaseCustodyRestrictions.VISITAION ? (
                    <Text
                      as="span"
                      variant="intro"
                      fontWeight="semiBold"
                      key={index}
                    >
                      {` heimsóknarbanni${
                        isLast ? '' : isNextLast && !isOnly ? ' og' : ','
                      }`}
                    </Text>
                  ) : (
                    ''
                  )
                },
              )}
            </Text>
            {` á meðan á gæsluvarðhaldinu stendur.`}
          </Text>
        )}
      </>
    )
  }
}

export const isNextDisabled = (requiredFields: RequiredField[]) => {
  // Loop through requiredFields
  for (let i = 0; i < requiredFields.length; i++) {
    // Loop through validations for each required field
    for (let a = 0; a < requiredFields[i].validations.length; a++) {
      if (
        !validate(requiredFields[i].value, requiredFields[i].validations[a])
          .isValid
      ) {
        return true
      }
    }
  }
  return false
}
