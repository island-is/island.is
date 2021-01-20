import React from 'react'
import { AppealDecisionRole, RequiredField } from '../types'
import { TagVariant, Text } from '@island.is/island-ui/core'
import {
  capitalize,
  formatAccusedByGender,
  formatDate,
  formatNationalId,
  TIME_FORMAT,
} from '@island.is/judicial-system/formatters'
import {
  Case,
  CaseAppealDecision,
  CaseCustodyRestrictions,
  CaseDecision,
  CaseGender,
} from '@island.is/judicial-system/types'
import { validate } from './validate'

export const getAppealDecisionText = (
  role: AppealDecisionRole,
  appealDecition?: CaseAppealDecision,
) => {
  switch (appealDecition) {
    case CaseAppealDecision.APPEAL: {
      return `${
        role === AppealDecisionRole.ACCUSED ? 'Kærði' : 'Sækjandi'
      } kærir úrskurðinn`
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
  if (workingCase.decision === CaseDecision.REJECTING) {
    return (
      <Text as="span" variant="intro">
        {`Kröfu um að ${formatAccusedByGender(
          workingCase.accusedGender || CaseGender.OTHER,
        )}, `}
        <Text
          as="span"
          variant="intro"
          color="blue400"
          fontWeight="semiBold"
        >{`${workingCase.accusedName}, kt. ${formatNationalId(
          workingCase.accusedNationalId,
        )}`}</Text>
        {`, sæti${
          workingCase.parentCase &&
          workingCase.parentCase?.decision === CaseDecision.ACCEPTING
            ? ' áframhaldandi'
            : ''
        } gæsluvarðhaldi er hafnað.`}
      </Text>
    )
  } else if (workingCase.decision === CaseDecision.ACCEPTING) {
    return (
      <Text as="span" variant="intro">
        {capitalize(
          formatAccusedByGender(workingCase.accusedGender || CaseGender.OTHER),
        )}
        ,
        <Text as="span" variant="intro" color="blue400" fontWeight="semiBold">
          {` ${workingCase.accusedName} kt. ${formatNationalId(
            workingCase.accusedNationalId,
          )}`}
        </Text>
        <Text as="span" variant="intro">
          {`, skal sæta${
            workingCase.parentCase &&
            workingCase.parentCase?.decision === CaseDecision.ACCEPTING
              ? ' áframhaldandi'
              : ''
          } gæsluvarðhaldi, þó ekki lengur en til`}
        </Text>
        <Text as="span" variant="intro" color="blue400" fontWeight="semiBold">
          {` ${formatDate(workingCase.custodyEndDate, 'PPPPp')
            ?.replace('dagur,', 'dagsins')
            ?.replace(' kl.', ', kl.')}.`}
        </Text>
        {workingCase.custodyRestrictions?.includes(
          CaseCustodyRestrictions.ISOLATION,
        ) ? (
          <>
            <Text as="span" variant="intro">
              {` ${capitalize(
                formatAccusedByGender(
                  workingCase.accusedGender || CaseGender.OTHER,
                ),
              )} skal `}
            </Text>
            <Text
              as="span"
              variant="intro"
              color="blue400"
              fontWeight="semiBold"
            >
              sæta einangrun
            </Text>
            <Text as="span" variant="intro">
              {' '}
              á meðan á gæsluvarðhaldinu stendur.
            </Text>
          </>
        ) : (
          <Text />
        )}
      </Text>
    )
  } else {
    return (
      <Text as="span" variant="intro">
        {capitalize(
          formatAccusedByGender(workingCase.accusedGender || CaseGender.OTHER),
        )}
        ,
        <Text
          as="span"
          variant="intro"
          color="blue400"
          fontWeight="semiBold"
        >{` ${workingCase.accusedName} kt. ${formatNationalId(
          workingCase.accusedNationalId,
        )}`}</Text>
        {`, skal sæta${
          workingCase.parentCase &&
          workingCase.parentCase?.decision ===
            CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
            ? ' áframhaldandi'
            : ''
        } farbanni, þó ekki lengur en til`}
        <Text as="span" variant="intro" color="blue400" fontWeight="semiBold">
          {` ${formatDate(workingCase.custodyEndDate, 'PPPPp')
            ?.replace('dagur,', 'dagsins')
            ?.replace(' kl.', ', kl.')}.`}
        </Text>
      </Text>
    )
  }
}

export const constructProsecutorDemands = (workingCase: Case) => {
  return workingCase.requestedCustodyEndDate ? (
    <Text>
      Þess er krafist að
      <Text as="span" fontWeight="semiBold">
        {` ${workingCase.accusedName}, kt.${formatNationalId(
          workingCase.accusedNationalId,
        )}`}
      </Text>
      {`, sæti${
        workingCase.parentCase &&
        workingCase.parentCase?.decision === CaseDecision.ACCEPTING
          ? ' áframhaldandi'
          : ''
      } gæsluvarðhaldi${
        workingCase.alternativeTravelBan
          ? `,${
              workingCase.parentCase &&
              workingCase.parentCase?.decision ===
                CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
                ? ' áframhaldandi'
                : ''
            } farbanni til vara,`
          : ''
      } með úrskurði ${workingCase.court?.replace(
        'Héraðsdómur',
        'Héraðsdóms',
      )}, til`}
      <Text as="span" fontWeight="semiBold">
        {` ${formatDate(workingCase.requestedCustodyEndDate, 'EEEE')?.replace(
          'dagur',
          'dagsins',
        )} ${formatDate(
          workingCase.requestedCustodyEndDate,
          'PPP',
        )}, kl. ${formatDate(
          workingCase.requestedCustodyEndDate,
          TIME_FORMAT,
        )}`}
      </Text>
      {workingCase.requestedCustodyRestrictions?.includes(
        CaseCustodyRestrictions.ISOLATION,
      ) ? (
        <>
          , og verði gert að{' '}
          <Text as="span" fontWeight="semiBold">
            sæta einangrun
          </Text>{' '}
          á meðan á varðhaldi stendur.
        </>
      ) : (
        '.'
      )}
    </Text>
  ) : (
    <Text>Saksóknari hefur ekki fyllt út dómkröfur.</Text>
  )
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

/**
 * A value is considered dirty if it's a string, either an empty string or not.
 * On the contrary a value is pristine if it's undefined or null.
 * @param value check if this value is dirty
 */
export const isDirty = (value?: string | null): boolean => {
  return typeof value === 'string'
}

export const getShortGender = (gender?: CaseGender): string => {
  switch (gender) {
    case CaseGender.MALE: {
      return 'kk'
    }
    case CaseGender.FEMALE: {
      return 'kvk'
    }
    case CaseGender.OTHER: {
      return 'annað'
    }
    default: {
      return ''
    }
  }
}

export const getRestrictionTagVariant = (
  restriction: CaseCustodyRestrictions,
): TagVariant => {
  switch (restriction) {
    case CaseCustodyRestrictions.COMMUNICATION:
    case CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT: {
      return 'rose'
    }
    case CaseCustodyRestrictions.ISOLATION: {
      return 'red'
    }
    case CaseCustodyRestrictions.MEDIA:
    case CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION: {
      return 'blueberry'
    }
    case CaseCustodyRestrictions.VISITAION: {
      return 'purple'
    }
    default: {
      return 'darkerBlue'
    }
  }
}
