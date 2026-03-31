/**
 * Validates mentioned regulation names (parsed from draft text) against the API.
 * Returns enriched options with "not found" / "repealed" labels, matching
 * the regulations-admin `useAffectedRegulations` + `formatSelRegOptions` behavior.
 */
import { useEffect, useMemo, useState } from 'react'
import { useApolloClient } from '@apollo/client'
import { prettyName, type RegName } from '@island.is/regulations'
import { REGULATION_OPTION_SEARCH_QUERY } from '../graphql/queries'
import type { SelRegOption } from '../components/regulations/ImpactBaseSelection'

type RegulationInfo = {
  title: string
  type: string
  repealed: boolean
  migrated: boolean
}

export const useMentionedRegulations = (
  mentionedNames: readonly RegName[],
  notFoundText: string,
  repealedText: string,
) => {
  const client = useApolloClient()
  const [regulationMap, setRegulationMap] = useState<
    Map<string, RegulationInfo | null>
  >(new Map())
  const [loading, setLoading] = useState(false)

  // Stable key for dependency tracking
  const namesKey = mentionedNames.join(',')

  useEffect(() => {
    if (mentionedNames.length === 0) {
      setRegulationMap(new Map())
      return
    }

    let cancelled = false
    setLoading(true)

    const fetchAll = async () => {
      const map = new Map<string, RegulationInfo | null>()

      await Promise.all(
        mentionedNames.map(async (name) => {
          try {
            const { data } = await client.query({
              query: REGULATION_OPTION_SEARCH_QUERY,
              variables: { input: { rn: String(name), iR: true } },
              fetchPolicy: 'network-only',
            })
            const regulations =
              data?.OJOIAGetRegulationsOptionSearch?.regulations ?? []
            const match = regulations.find(
              (r: { name: string }) => r.name === String(name),
            )
            map.set(
              String(name),
              match
                ? {
                    title: match.title,
                    type: match.type,
                    repealed: !!match.repealed,
                    migrated: !!match.migrated,
                  }
                : null,
            )
          } catch {
            map.set(String(name), null)
          }
        }),
      )

      if (!cancelled) {
        setRegulationMap(map)
        setLoading(false)
      }
    }

    fetchAll()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namesKey, client])

  const options: SelRegOption[] = useMemo(() => {
    if (regulationMap.size === 0 && mentionedNames.length > 0) {
      // Still loading — return simple name-only options
      return mentionedNames.map((name) => ({
        value: String(name),
        label: String(name),
      }))
    }

    return mentionedNames.map((name): SelRegOption => {
      const reg = regulationMap.get(String(name))
      if (reg) {
        return {
          value: String(name),
          label:
            prettyName(name) +
            ' – ' +
            reg.title +
            (reg.repealed ? ` (${repealedText})` : ''),
          type: reg.type,
          disabled: reg.repealed,
          migrated: reg.migrated,
        }
      }
      return {
        value: '',
        label: prettyName(name) + ' ' + notFoundText,
        disabled: true,
      }
    })
  }, [mentionedNames, regulationMap, notFoundText, repealedText])

  return { options, loading }
}
