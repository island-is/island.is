/**
 * Validates mentioned regulation names (parsed from draft text) against the API.
 * Returns enriched options with "not found" / "repealed" labels, matching
 * the regulations-admin `useAffectedRegulations` + `formatSelRegOptions` behavior.
 *
 * Uses a single batch query (`getRegulationOptionList`) instead of N individual
 * search queries, fixing both performance and correctness issues.
 */
import { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { prettyName, type RegName } from '@island.is/regulations'
import { REGULATION_OPTION_LIST_QUERY } from '../graphql/queries'
import type { SelRegOption } from '../components/regulations/ImpactBaseSelection'

type RegulationOptionListResponse = {
  OJOIAGetRegulationOptionList: {
    regulations: Array<{
      name: string
      title: string
      type: string
      migrated: boolean
      repealed?: boolean
    }>
  } | null
}

export const useMentionedRegulations = (
  mentionedNames: readonly RegName[],
  notFoundText: string,
  repealedText: string,
) => {
  const { data, loading } = useQuery<RegulationOptionListResponse>(
    REGULATION_OPTION_LIST_QUERY,
    {
      variables: { input: { names: mentionedNames.map(String) } },
      skip: mentionedNames.length === 0,
      fetchPolicy: 'network-only',
    },
  )

  const options: SelRegOption[] = useMemo(() => {
    if (mentionedNames.length === 0) {
      return []
    }

    const regulations = data?.OJOIAGetRegulationOptionList?.regulations ?? []

    return mentionedNames.map((name): SelRegOption => {
      const reg = regulations.find((r) => r.name === String(name))
      if (reg) {
        return {
          value: String(name),
          label:
            prettyName(name) +
            ' – ' +
            reg.title +
            (reg.repealed ? ` (${repealedText})` : ''),
          type: reg.type,
          disabled: !!reg.repealed,
          migrated: reg.migrated,
        }
      }
      return {
        value: '',
        label: prettyName(name) + ' ' + notFoundText,
        disabled: true,
      }
    })
  }, [mentionedNames, data, notFoundText, repealedText])

  return { options, loading }
}
