import React from 'react'
import { AppealDecisionRole, RequiredField } from '../types'
import { Text } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  Case,
  CaseAppealDecision,
  CaseCustodyRestrictions,
} from '@island.is/judicial-system/types'
import { validate } from './validate'

export const getAppealDecitionText = (
  role: AppealDecisionRole,
  appealDecition?: CaseAppealDecision,
) => {
  switch (appealDecition) {
    case CaseAppealDecision.APPEAL: {
      return `${
        role === AppealDecisionRole.ACCUSED ? 'Kærði' : 'Sækjandi'
      } kærir málið`
    }
    case CaseAppealDecision.ACCEPT: {
      return `${
        role === AppealDecisionRole.ACCUSED ? 'Kærði' : 'Sækjandi'
      } unir úrskurðinum`
    }
    case CaseAppealDecision.POSTPONE: {
      return `${
        role === AppealDecisionRole.ACCUSED ? 'Kærði' : 'Sækjandi'
      } tekur sér lögboðinn frest`
    }
    default: {
      return ''
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
                    workingCase.custodyRestrictions &&
                    index === workingCase.custodyRestrictions.length - 2
                  const isLast =
                    workingCase.custodyRestrictions &&
                    index === workingCase.custodyRestrictions.length - 1
                  const isOnly =
                    workingCase.custodyRestrictions &&
                    workingCase.custodyRestrictions.length === 1

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
