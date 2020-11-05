import React from 'react'
import { AppealDecisionRole, RequiredField } from '../types'
import { parseString } from './formatters'
import { Text } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  Case,
  CaseAppealDecision,
  CaseCustodyRestrictions,
  UpdateCase,
} from '@island.is/judicial-system/types'
import { validate } from './validate'

export const createCaseFromDraft = (caseDraft: string): Case => {
  const caseDraftJSON = JSON.parse(caseDraft || '{}')

  return {
    id: caseDraftJSON.id ?? '',
    created: caseDraftJSON.created ?? '',
    modified: caseDraftJSON.modified ?? '',
    state: caseDraftJSON.state ?? '',
    policeCaseNumber: caseDraftJSON.policeCaseNumber ?? '',
    accusedNationalId: caseDraftJSON.accusedNationalId ?? '',
    accusedName: caseDraftJSON.accusedName ?? '',
    accusedAddress: caseDraftJSON.accusedAddress ?? '',
    accusedGender: caseDraftJSON.accusedGender ?? '',
    court: caseDraftJSON.court ?? 'Héraðsdómur Reykjavíkur',
    arrestDate: caseDraftJSON.arrestDate ?? null,
    requestedCourtDate: caseDraftJSON.requestedCourtDate ?? null,
    requestedCustodyEndDate: caseDraftJSON.requestedCustodyEndDate ?? null,
    lawsBroken: caseDraftJSON.lawsBroken ?? '',
    custodyProvisions: caseDraftJSON.custodyProvisions ?? [],
    requestedCustodyRestrictions:
      caseDraftJSON.requestedCustodyRestrictions ?? [],
    caseFacts: caseDraftJSON.caseFacts ?? '',
    witnessAccounts: caseDraftJSON.witnessAccounts ?? '',
    investigationProgress: caseDraftJSON.investigationProgress ?? '',
    legalArguments: caseDraftJSON.legalArguments ?? '',
    comments: caseDraftJSON.comments ?? '',
    // prosecutorId: caseDraftJSON.prosecutorId ?? null,
    prosecutor: caseDraftJSON.prosecutor ?? null,
    courtCaseNumber: caseDraftJSON.courtCaseNumber ?? '',
    courtDate: caseDraftJSON.courtDate ?? '',
    courtRoom: caseDraftJSON.courtRoom ?? '',
    defenderName: caseDraftJSON.defenderName ?? '',
    defenderEmail: caseDraftJSON.defenderEmail ?? '',
    courtStartTime: caseDraftJSON.courtStartTime ?? '',
    courtEndTime: caseDraftJSON.courtEndTime ?? '',
    courtAttendees: caseDraftJSON.courtAttendees ?? '',
    policeDemands: caseDraftJSON.policeDemands ?? '',
    accusedPlea: caseDraftJSON.accusedPlea ?? '',
    litigationPresentations: caseDraftJSON.litigationPresentations ?? '',
    ruling: caseDraftJSON.ruling ?? '',
    rejecting: caseDraftJSON.rejecting ?? false,
    custodyEndDate: caseDraftJSON.custodyEndDate ?? '',
    custodyRestrictions: caseDraftJSON.custodyRestrictions ?? [],
    accusedAppealDecision: caseDraftJSON.accusedAppealDecision ?? '',
    accusedAppealAnnouncement: caseDraftJSON.accusedAppealAnnouncement ?? '',
    prosecutorAppealDecision: caseDraftJSON.prosecutorAppealDecision ?? '',
    prosecutorAppealAnnouncement:
      caseDraftJSON.prosecutorAppealAnnouncement ?? '',
    // judgeId: caseDraftJSON.judgeId ?? null,
    judge: caseDraftJSON.judge ?? null,
    // notifications: caseDraftJSON.Notification ?? [],
  }
}

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
  updateCase: (id: string, updateCase: UpdateCase) => Promise<Case>,
) => {
  console.warn('Calling AutoSave() is discuraged. Will be removed shortly.')
  // Only save if the field has changes and the case exists
  if (state[caseField] !== caseFieldValue && state.id !== '') {
    // Parse the property change
    const propertyChange = parseString(caseField, caseFieldValue)

    // Save the case
    const updatedCase = await updateCase(state.id, propertyChange)

    if (updatedCase) {
      // Update the working case
      updateState(state, caseField, caseFieldValue, stateSetter)
    } else {
      // TODO: Do something when autosave fails
    }
  }
}

export const getAppealDecitionText = (
  role: AppealDecisionRole,
  appealDecition: CaseAppealDecision,
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
