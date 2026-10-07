import { formatNationalId } from '@island.is/judicial-system/formatters'
import {
  AppealSummonsAppellantSide,
  prosecutionRoles,
} from '@island.is/judicial-system/types'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import type {
  AppealEventLog,
  AppealSummons,
  CivilClaimant,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { AppealEventType } from '@island.is/judicial-system-web/src/graphql/schema'

type PrefillDefendant = {
  name?: string | null
  nationalId?: string | null
  address?: string | null
}

type PrefillCivilClaimant = {
  name?: string | null
  nationalId?: string | null
}

const DEFENCE_CLAIMS =
  'Ákærði krefst þess aðallega að hann verði sýknaður, en til vara að refsing og önnur viðurlög verði felld niður og til þrautavara að tildæmd refsing verði lækkuð verulega. Þá er þess krafist að allur sakarkostnaður verði lagður á ríkissjóð.'

const prosecutionClaims = (defendant: PrefillDefendant): string =>
  `Málinu er áfrýjað gagnvart ákærða, ${
    defendant.name ?? ''
  }, kennitala ${formatNationalId(defendant.nationalId)}, ${
    defendant.address ?? ''
  }. Ákæruvaldið krefst þess að ákærði verði sakfelldur fyrir þá háttsemi sem honum er gefin að sök í ákæru, og dæmdur til refsingar. Þá er þess krafist að ákærða verði gert að greiða allan sakarkostnað.`

const civilClaimantLines = (civilClaimants: PrefillCivilClaimant[]): string => {
  if (civilClaimants.length === 0) {
    return ''
  }

  const heading =
    civilClaimants.length === 1
      ? 'Dæmda einkaréttarkröfu á:'
      : 'Dæmdar einkaréttarkröfur eiga:'

  const awarded = civilClaimants
    .map(
      (claimant) =>
        `${claimant.name ?? ''}, kennitala ${formatNationalId(
          claimant.nationalId,
        )}, heimilisfang.`,
    )
    .join('\n')

  const raised = civilClaimants
    .map(
      (claimant) =>
        `${claimant.name ?? ''} hafði uppi einkaréttarkröfu fyrir héraðsdómi.`,
    )
    .join('\n')

  return `\n\n${heading}\n${awarded}\n\n${raised}`
}

export const prefillAppealSummonsClaims = (
  appellantSide: AppealSummonsAppellantSide,
  defendant: PrefillDefendant,
  civilClaimants: PrefillCivilClaimant[] = [],
): string => {
  const base =
    appellantSide === AppealSummonsAppellantSide.PROSECUTION
      ? prosecutionClaims(defendant)
      : DEFENCE_CLAIMS

  return `${base}${civilClaimantLines(civilClaimants)}`
}

const prosecutionRoleNames: string[] = prosecutionRoles

const isProsecutionEvent = (eventLog: AppealEventLog): boolean =>
  Boolean(eventLog.userRole && prosecutionRoleNames.includes(eventLog.userRole))

export type StandingAppealSummonsDefendant = {
  defendantId: string
  name?: string | null
  nationalId?: string | null
  address?: string | null
  appellantSide: AppealSummonsAppellantSide
  appealDate?: string
}

/**
 * Defendants with a standing verdict appeal, one row each. When both sides
 * stand for the same defendant the prosecution wording wins (design Q-G).
 * Mirrors standingVerdictAppellants on the backend.
 */
export const getStandingAppealSummonsDefendants = (
  workingCase: Pick<WorkingCase, 'defendants' | 'verdictAppealCase'>,
): StandingAppealSummonsDefendant[] => {
  const verdictAppealCase = workingCase.verdictAppealCase
  const latestByKey = new Map<string, AppealEventLog>()

  for (const eventLog of verdictAppealCase?.appealEventLogs ?? []) {
    if (
      !eventLog.defendantId ||
      !eventLog.created ||
      (eventLog.eventType !== AppealEventType.APPEALED &&
        eventLog.eventType !== AppealEventType.APPEAL_WITHDRAWN)
    ) {
      continue
    }

    const side = isProsecutionEvent(eventLog)
      ? AppealSummonsAppellantSide.PROSECUTION
      : AppealSummonsAppellantSide.DEFENCE
    const key = `${eventLog.defendantId}:${side}`
    const latest = latestByKey.get(key)

    if (!latest || eventLog.created > (latest.created ?? '')) {
      latestByKey.set(key, eventLog)
    }
  }

  const standingByDefendant = new Map<
    string,
    {
      defence?: AppealEventLog
      prosecution?: AppealEventLog
    }
  >()

  for (const [key, eventLog] of latestByKey) {
    if (eventLog.eventType !== AppealEventType.APPEALED) {
      continue
    }

    const [defendantId, side] = key.split(':')
    const entry = standingByDefendant.get(defendantId) ?? {}

    if (side === AppealSummonsAppellantSide.PROSECUTION) {
      entry.prosecution = eventLog
    } else {
      entry.defence = eventLog
    }

    standingByDefendant.set(defendantId, entry)
  }

  return (workingCase.defendants ?? []).flatMap((defendant) => {
    const standing = standingByDefendant.get(defendant.id)

    if (!standing) {
      return []
    }

    const appellantSide = standing.prosecution
      ? AppealSummonsAppellantSide.PROSECUTION
      : AppealSummonsAppellantSide.DEFENCE

    const appealDate =
      appellantSide === AppealSummonsAppellantSide.PROSECUTION
        ? standing.prosecution?.created ?? undefined
        : defendant.verdict?.appealDate ??
          standing.defence?.created ??
          undefined

    return [
      {
        defendantId: defendant.id,
        name: defendant.name,
        nationalId: defendant.nationalId,
        address: defendant.address,
        appellantSide,
        appealDate,
      },
    ]
  })
}

export const getEarliestStandingAppealDate = (
  defendants: Pick<StandingAppealSummonsDefendant, 'appealDate'>[],
): string | undefined => {
  const dates = defendants
    .map((defendant) => defendant.appealDate)
    .filter((date): date is string => Boolean(date))
    .sort()

  return dates[0]
}

export type AppealSummonsFormSection = {
  defendantId: string
  name?: string | null
  appellantSide: AppealSummonsAppellantSide
  claims: string
  included: boolean
}

export const buildAppealSummonsFormSections = (
  standing: StandingAppealSummonsDefendant[],
  civilClaimants: Pick<CivilClaimant, 'name' | 'nationalId'>[] = [],
  existingSummons?: Pick<AppealSummons, 'defendants'> | null,
): AppealSummonsFormSection[] => {
  const existingByDefendant = new Map(
    (existingSummons?.defendants ?? []).map((row) => [row.defendantId, row]),
  )

  return standing.map((defendant) => {
    const existing = existingByDefendant.get(defendant.defendantId)

    return {
      defendantId: defendant.defendantId,
      name: defendant.name,
      appellantSide: defendant.appellantSide,
      included: existingSummons
        ? existingByDefendant.has(defendant.defendantId)
        : true,
      claims:
        existing?.claims ??
        prefillAppealSummonsClaims(
          defendant.appellantSide,
          defendant,
          civilClaimants,
        ),
    }
  })
}

export const isAppealSummonsFormReady = (
  sections: Pick<AppealSummonsFormSection, 'included' | 'claims'>[],
): boolean => {
  const included = sections.filter((section) => section.included)

  return (
    included.length > 0 &&
    included.every((section) => section.claims.trim().length > 0)
  )
}

export const appellantSideLabel = (
  appellantSide: AppealSummonsAppellantSide,
): string =>
  appellantSide === AppealSummonsAppellantSide.PROSECUTION
    ? 'Ákæruvaldið áfrýjaði dómi'
    : 'Ákærði áfrýjaði dómi'

export type AppealSummonsDefendantInput = {
  defendantId: string
  appellantSide: AppealSummonsAppellantSide
  claims: string
}

export const toAppealSummonsDefendantInputs = (
  sections: AppealSummonsFormSection[],
): AppealSummonsDefendantInput[] =>
  sections
    .filter((section) => section.included)
    .map(({ defendantId, appellantSide, claims }) => ({
      defendantId,
      appellantSide,
      claims: claims.trim(),
    }))
