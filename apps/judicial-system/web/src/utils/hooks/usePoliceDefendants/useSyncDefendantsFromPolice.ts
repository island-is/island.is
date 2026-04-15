import { useContext, useRef } from 'react'

import { isRestrictionCase } from '@island.is/judicial-system/types'
import { FormContext } from '@island.is/judicial-system-web/src/components'
import { CaseOrigin } from '@island.is/judicial-system-web/src/graphql/schema'
import { useDefendants } from '@island.is/judicial-system-web/src/utils/hooks'
import { mapStringToGender } from '@island.is/judicial-system-web/src/utils/utils'

import {
  PoliceDefendantsQuery,
  usePoliceDefendantsQuery,
} from './policeDefendants.generated'

/**
 * Fetches defendants from the police API (LOKE) and syncs by nationalId:
 * - Adds defendants whose nationalId is in the payload but not in our list.
 * - Does nothing for nationalIds that already exist.
 * - Does nothing for nationalIds that exist in our data but not in the payload (no removal).
 */
export const useSyncDefendantsFromPolice = () => {
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { createDefendant } = useDefendants()
  const syncingRef = useRef(false)

  const { loading, error, refetch } = usePoliceDefendantsQuery({
    variables: { input: { caseId: workingCase.id } },
    skip: workingCase.origin !== CaseOrigin.LOKE || !workingCase.id,
    fetchPolicy: 'cache-first',
    onCompleted: (data: PoliceDefendantsQuery) => {
      const policeDefendants = data?.policeDefendants
      if (!policeDefendants?.length || syncingRef.current) {
        return
      }

      syncingRef.current = true

      setWorkingCase((prev) => {
        const existingNationalIds = new Set(
          (prev.defendants ?? [])
            .map((d) => d.nationalId)
            .filter((id): id is string => Boolean(id)),
        )

        if (
          isRestrictionCase(workingCase.type) &&
          (prev.defendants?.length ?? 0) > 0
        ) {
          syncingRef.current = false
          return prev
        }

        const toAdd = policeDefendants
          .filter(
            (p) => p.nationalId && !existingNationalIds.has(p.nationalId),
          )
          .slice(0, isRestrictionCase(workingCase.type) ? 1 : undefined)

        if (toAdd.length === 0) {
          syncingRef.current = false
          return prev
        }

        const sync = async () => {
          const defendantPromises = toAdd.map(async (p) => {
            const defendant = await createDefendant({
              caseId: workingCase.id,
              nationalId: p.nationalId ?? undefined,
              name: p.name ?? undefined,
              gender: mapStringToGender(p.gender),
              address: p.address ?? undefined,
              citizenship: p.citizenship ?? undefined,
            })
            return defendant ? { defendantId: defendant, p } : null
          })
          const results = await Promise.all(defendantPromises)
          const newDefendants = results
            .filter(
              (
                r,
              ): r is {
                defendantId: string
                p: typeof toAdd[number]
              } => Boolean(r),
            )
            .map(({ defendantId, p }) => ({
              id: defendantId,
              nationalId: p.nationalId,
              name: p.name,
              gender: mapStringToGender(p.gender),
              address: p.address,
              citizenship: p.citizenship,
            }))

          if (newDefendants.length > 0) {
            setWorkingCase((prev) => ({
              ...prev,
              defendants: [...(prev.defendants ?? []), ...newDefendants],
            }))
          }

          syncingRef.current = false
        }

        sync()

        return prev
      })
    },
  })

  return { loading, error, refetch }
}
