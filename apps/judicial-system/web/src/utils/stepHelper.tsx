import React from 'react'
import {
  AppealDecisionRole,
  RequiredField,
} from '@island.is/judicial-system-web/src/types'
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
  CaseType,
} from '@island.is/judicial-system/types'
import { validate } from './validate'
import compareAsc from 'date-fns/compareAsc'
import parseISO from 'date-fns/parseISO'
import addDays from 'date-fns/addDays'

export const getAppealDecisionText = (
  role: AppealDecisionRole,
  appealDecition?: CaseAppealDecision,
  accusedGender?: CaseGender,
) => {
  switch (appealDecition) {
    case CaseAppealDecision.APPEAL: {
      return `${
        role === AppealDecisionRole.ACCUSED
          ? capitalize(formatAccusedByGender(accusedGender || CaseGender.OTHER))
          : 'Sækjandi'
      } kærir úrskurðinn`
    }
    case CaseAppealDecision.ACCEPT: {
      return `${
        role === AppealDecisionRole.ACCUSED
          ? capitalize(formatAccusedByGender(accusedGender || CaseGender.OTHER))
          : 'Sækjandi'
      } unir úrskurðinum`
    }
    case CaseAppealDecision.POSTPONE: {
      return `${
        role === AppealDecisionRole.ACCUSED
          ? capitalize(formatAccusedByGender(accusedGender || CaseGender.OTHER))
          : 'Sækjandi'
      } tekur sér lögboðinn frest`
    }
    default: {
      return ''
    }
  }
}

export const getConclusion = (wc: Case, isLarge?: boolean) => {
  switch (wc.decision) {
    case CaseDecision.REJECTING:
      return getRejectingConclusion(wc, isLarge)
    case CaseDecision.ACCEPTING:
      return getAcceptingConclusion(wc, isLarge)
    case CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN:
      return getAcceptingAlternativeTravelBanConclusion(wc, isLarge)
    default:
      return <Text />
  }
}

const getRejectingConclusion = (wc: Case, large?: boolean) => {
  const genderFormattedAccusedName = formatAccusedByGender(
    wc.accusedGender || CaseGender.OTHER,
  )

  const accusedNameAndNationalId = `${wc.accusedName}, kt. ${formatNationalId(
    wc.accusedNationalId,
  )}`

  const isExtension =
    wc.parentCase && wc.parentCase?.decision === CaseDecision.ACCEPTING

  const isTravelBan = wc.type === CaseType.TRAVEL_BAN

  return (
    <Text variant={large ? 'intro' : 'default'}>
      {`Kröfu um að ${genderFormattedAccusedName}, `}
      <Text
        as="span"
        variant={large ? 'intro' : 'default'}
        color={large ? 'blue400' : 'dark400'}
        fontWeight="semiBold"
      >
        {accusedNameAndNationalId}
      </Text>
      {`, sæti${isExtension ? ' áframhaldandi' : ''} ${
        isTravelBan ? 'farbanni' : 'gæsluvarðhaldi'
      } er hafnað.`}
    </Text>
  )
}

const getAcceptingConclusion = (wc: Case, large?: boolean) => {
  const genderFormattedAccusedName = capitalize(
    formatAccusedByGender(wc.accusedGender || CaseGender.OTHER),
  )

  const accusedNameAndNationalId = `${wc.accusedName} kt. ${formatNationalId(
    wc.accusedNationalId,
  )}`

  const isExtension =
    wc.parentCase && wc.parentCase?.decision === CaseDecision.ACCEPTING

  const isTravelBan = wc.type === CaseType.TRAVEL_BAN

  const formattedValidToDateAndTime = `${formatDate(wc.validToDate, 'PPPPp')
    ?.replace('dagur,', 'dagsins')
    ?.replace(' kl.', ', kl.')}`

  const formattedIsolationToDateAndTime = `${formatDate(wc.isolationTo, 'PPPPp')
    ?.replace('dagur,', 'dagsins')
    ?.replace(' kl.', ', kl.')}`

  const accusedShouldBeInIsolation =
    wc.type === CaseType.CUSTODY &&
    wc.custodyRestrictions?.includes(CaseCustodyRestrictions.ISOLATION)

  const isolationIsSameAsValidToDate =
    wc.validToDate &&
    wc.isolationTo &&
    compareAsc(parseISO(wc.validToDate), parseISO(wc.isolationTo)) === 0

  return (
    <Text variant={large ? 'intro' : 'default'}>
      {genderFormattedAccusedName},
      <Text
        as="span"
        variant={large ? 'intro' : 'default'}
        color={large ? 'blue400' : 'dark400'}
        fontWeight="semiBold"
      >
        {` ${accusedNameAndNationalId}`}
      </Text>
      <Text as="span" variant={large ? 'intro' : 'default'}>
        {`, skal sæta${isExtension ? ' áframhaldandi' : ''} ${
          isTravelBan ? 'farbanni' : 'gæsluvarðhaldi'
        }, þó ekki lengur en til`}
      </Text>
      <Text
        as="span"
        variant={large ? 'intro' : 'default'}
        color={large ? 'blue400' : 'dark400'}
        fontWeight="semiBold"
      >
        {` ${formattedValidToDateAndTime}.`}
      </Text>
      {accusedShouldBeInIsolation && (
        <>
          <Text
            as="span"
            variant={large ? 'intro' : 'default'}
          >{` ${genderFormattedAccusedName} skal `}</Text>
          <Text
            as="span"
            variant={large ? 'intro' : 'default'}
            color={large ? 'blue400' : 'dark400'}
            fontWeight="semiBold"
          >
            sæta einangrun
          </Text>
          {isolationIsSameAsValidToDate ? (
            <Text
              as="span"
              variant={large ? 'intro' : 'default'}
            >{` á meðan á gæsluvarðhaldinu stendur.`}</Text>
          ) : (
            <Text as="span" variant={large ? 'intro' : 'default'}>
              {` ekki lengur en til`}
              <Text
                as="span"
                variant={large ? 'intro' : 'default'}
                color={large ? 'blue400' : 'dark400'}
                fontWeight="semiBold"
              >
                {` ${formattedIsolationToDateAndTime}.`}
              </Text>
            </Text>
          )}
        </>
      )}
    </Text>
  )
}

const getAcceptingAlternativeTravelBanConclusion = (
  wc: Case,
  large?: boolean,
): JSX.Element => {
  const genderFormattedAccusedName = capitalize(
    formatAccusedByGender(wc.accusedGender || CaseGender.OTHER),
  )

  const accusedNameAndNationalId = `${wc.accusedName} kt. ${formatNationalId(
    wc.accusedNationalId,
  )}`

  const isExtension =
    wc.parentCase &&
    wc.parentCase?.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN

  const formattedValidToDateAndTime = `${formatDate(wc.validToDate, 'PPPPp')
    ?.replace('dagur,', 'dagsins')
    ?.replace(' kl.', ', kl.')}`

  return (
    <Text variant={large ? 'intro' : 'default'}>
      {genderFormattedAccusedName},
      <Text
        as="span"
        variant={large ? 'intro' : 'default'}
        color={large ? 'blue400' : 'dark400'}
        fontWeight="semiBold"
      >{` ${accusedNameAndNationalId}`}</Text>
      {`, skal sæta${
        isExtension ? ' áframhaldandi' : ''
      } farbanni, þó ekki lengur en til`}
      <Text
        as="span"
        variant={large ? 'intro' : 'default'}
        color={large ? 'blue400' : 'dark400'}
        fontWeight="semiBold"
      >
        {` ${formattedValidToDateAndTime}.`}
      </Text>
    </Text>
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

export const kb = (bytes?: number) => {
  return bytes ? Math.ceil(bytes / 1024) : ''
}

export const getAppealEndDate = (rulingDate: string) => {
  const rulingDateToDate = parseISO(rulingDate)
  const appealEndDate = addDays(rulingDateToDate, 3)
  return formatDate(appealEndDate, 'PPPp')
}
