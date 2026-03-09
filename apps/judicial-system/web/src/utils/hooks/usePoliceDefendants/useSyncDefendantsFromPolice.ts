import { useContext, useEffect } from 'react'

import { FormContext } from '@island.is/judicial-system-web/src/components'
import {
  CaseOrigin,
  Gender,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useDefendants } from '@island.is/judicial-system-web/src/utils/hooks'

import { usePoliceDefendantsQuery } from './policeDefendants.generated'

const mapPoliceGenderToGender = (gender?: string | null): Gender | undefined =>
  gender?.toLowerCase() === 'male'
    ? Gender.MALE
    : gender?.toLowerCase() === 'female'
    ? Gender.FEMALE
    : gender?.toLowerCase() === 'other'
    ? Gender.OTHER
    : undefined

/**
 * Fetches defendants from the police API (LOKE) and syncs by nationalId:
 * - Adds defendants whose nationalId is in the payload but not in our list.
 * - Does nothing for nationalIds that already exist.
 * - Does nothing for nationalIds that exist in our data but not in the payload (no removal).
 */
export const useSyncDefendantsFromPolice = () => {
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { createDefendant } = useDefendants()

  const {
    data: policeDefendantsData,
    loading,
    error,
    refetch,
  } = usePoliceDefendantsQuery({
    variables: { input: { caseId: workingCase.id } },
    skip: workingCase.origin !== CaseOrigin.LOKE || !workingCase.id,
    fetchPolicy: 'cache-first',
  })

  useEffect(() => {
    if (!workingCase.id) {
      return
    }
    const payload = policeDefendantsData?.policeDefendants
    if (!payload?.length) {
      return
    }

    const existingNationalIds = new Set(
      (workingCase.defendants ?? [])
        .map((d) => d.nationalId)
        .filter((id): id is string => Boolean(id)),
    )

    const toAdd = payload.filter(
      (p) => p.nationalId && !existingNationalIds.has(p.nationalId),
    )
    if (toAdd.length === 0) {
      return
    }

    const sync = async () => {
      const newDefendants: {
        id: string
        nationalId?: string | null
        name?: string | null
        gender?: Gender
        address?: string | null
        citizenship?: string | null
      }[] = []
      for (const p of toAdd) {
        const defendantId = await createDefendant({
          caseId: workingCase.id,
          nationalId: p.nationalId ?? undefined,
          name: p.name ?? undefined,
          gender: mapPoliceGenderToGender(p.gender),
          address: p.address ?? undefined,
          citizenship: p.citizenship ?? undefined,
        })
        if (defendantId) {
          newDefendants.push({
            id: defendantId,
            nationalId: p.nationalId,
            name: p.name,
            gender: mapPoliceGenderToGender(p.gender),
            address: p.address,
            citizenship: p.citizenship,
          })
        }
      }
      if (newDefendants.length > 0) {
        setWorkingCase((prev) => ({
          ...prev,
          defendants: [...(prev.defendants ?? []), ...newDefendants],
        }))
      }
    }
    sync()
  }, [
    workingCase.id,
    workingCase.defendants,
    policeDefendantsData?.policeDefendants,
    createDefendant,
    setWorkingCase,
  ])

  return { loading, error, refetch }
}
