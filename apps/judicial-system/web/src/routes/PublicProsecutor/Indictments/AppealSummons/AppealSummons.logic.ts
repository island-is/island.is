import { formatNationalId } from '@island.is/judicial-system/formatters'
import { AppealSummonsAppellantSide } from '@island.is/judicial-system/types'

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
        )}, heimilisfang, Reykjavík.`,
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
