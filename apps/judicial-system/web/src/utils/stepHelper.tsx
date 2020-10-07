import {
  AppealDecision,
  AppealDecitionRole,
  Case,
  CustodyRestrictions,
} from '../types'
import * as api from '../api'
import { formatDate, parseString } from './formatters'
import React from 'react'
import { FormStepper, Typography } from '@island.is/island-ui/core'

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
  if (workingCase.rejecting) {
    return <Typography as="span">Beiðni um gæsluvarðhald hafnað</Typography>
  } else {
    return (
      <>
        <Typography as="span">{`Kærði, `}</Typography>
        <Typography as="span" color="blue400" fontWeight="semiBold">
          {`${workingCase.accusedName} kt.${workingCase.accusedNationalId} `}
        </Typography>
        <Typography as="span">
          skal sæta gæsluvarðhaldi, þó ekki lengur en til
        </Typography>
        <Typography as="span" color="blue400" fontWeight="semiBold">
          {` ${formatDate(workingCase.custodyEndDate, 'PPPp')}. `}
        </Typography>
        {workingCase.custodyRestrictions.length === 0 ? (
          <Typography as="span">
            Engar takmarkanir skulu vera á gæslunni.
          </Typography>
        ) : (
          <Typography as="span">
            Kærði skal sæta
            <Typography as="span" color="blue400" fontWeight="semiBold">
              {workingCase.custodyRestrictions.map(
                (custodyRestriction, index) => {
                  const isNextLast =
                    index === workingCase.custodyRestrictions.length - 2
                  const isLast =
                    index === workingCase.custodyRestrictions.length - 1
                  const isOnly = workingCase.custodyRestrictions.length === 1

                  return custodyRestriction ===
                    CustodyRestrictions.ISOLATION ? (
                    <Typography as="span" key={index}>
                      {` einangrun${
                        isLast ? '' : isNextLast && !isOnly ? ' og' : ', '
                      }`}
                    </Typography>
                  ) : custodyRestriction ===
                    CustodyRestrictions.COMMUNICATION ? (
                    <Typography as="span" key={index}>
                      {` bréfa, og símabanni${
                        isLast ? '' : isNextLast && !isOnly ? ' og' : ','
                      }`}
                    </Typography>
                  ) : custodyRestriction === CustodyRestrictions.MEDIA ? (
                    <Typography as="span" key={index}>
                      {` fjölmiðlabanni${
                        isLast ? '' : isNextLast && !isOnly ? ' og' : ','
                      }`}
                    </Typography>
                  ) : custodyRestriction === CustodyRestrictions.VISITAION ? (
                    <Typography as="span" key={index}>
                      {` heimsóknarbanni${
                        isLast ? '' : isNextLast && !isOnly ? ' og' : ','
                      }`}
                    </Typography>
                  ) : (
                    ''
                  )
                },
              )}
            </Typography>
            {` á meðan á gæsluvarðhaldinu stendur.`}
          </Typography>
        )}
      </>
    )
  }
}

export const renderFormStepper = (
  activeSection: number,
  activeSubsection: number,
) => {
  return (
    <FormStepper
      sections={[
        {
          name: 'Krafa um gæsluvarðahald',
          children: [
            { type: 'SUB_SECTION', name: 'Grunnupplýsingar' },
            { type: 'SUB_SECTION', name: 'Málsatvik og lagarök' },
            { type: 'SUB_SECTION', name: 'Yfirlit kröfu' },
          ],
        },
        {
          name: 'Úrskurður Héraðsdóms',
          children: [
            { type: 'SUB_SECTION', name: 'Yfirlit kröfu' },
            { type: 'SUB_SECTION', name: 'Þingbók' },
            { type: 'SUB_SECTION', name: 'Úrskurður' },
            { type: 'SUB_SECTION', name: 'Yfirlit úrskurðar' },
          ],
        },
      ]}
      activeSection={activeSection}
      activeSubSection={activeSubsection}
    />
  )
}
