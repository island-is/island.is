import { useContext, useMemo } from 'react'

import type { CaseTableGroup } from '@island.is/judicial-system/types'
import {
  CaseTableType,
  Feature,
  getCaseTableGroups,
} from '@island.is/judicial-system/types'
import { FeatureContext } from '@island.is/judicial-system-web/src/components/FeatureProvider/FeatureProvider'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'

// Tables that belong to a feature which is still hidden. The lists themselves
// are harmless with the feature off - there is nothing for them to show - but
// they must not be offered until it is on.
//
// This whole module is scaffolding for that wait. When the last entry below
// goes - INDICTMENT_APPEAL being lifted empties it - the groups are static
// again: delete the hook and getVisibleCaseTableGroups with its spec, and put
// `getCaseTableGroups(user)` back in CaseTableGroups, BreadCrumbs and
// SearchModal. Keeping an empty filter around would leave three components
// depending on FeatureContext for nothing.
const tableFeatures: Partial<Record<CaseTableType, Feature>> = {
  [CaseTableType.COURT_OF_APPEALS_VERDICT_APPEALS_IN_PROGRESS]:
    Feature.INDICTMENT_APPEAL,
  [CaseTableType.COURT_OF_APPEALS_VERDICT_APPEALS_COMPLETED]:
    Feature.INDICTMENT_APPEAL,
}

export const getVisibleCaseTableGroups = (
  groups: CaseTableGroup[],
  features: Feature[],
): CaseTableGroup[] =>
  groups
    .map((group) => ({
      ...group,
      tables: group.tables.filter((table) => {
        const feature = tableFeatures[table.type as CaseTableType]

        return !feature || features.includes(feature)
      }),
    }))
    .filter((group) => group.tables.length > 0)

/**
 * The case table groups this user may be offered, with the ones behind a hidden
 * feature left out.
 *
 * Hiding is deliberately only this - the route still resolves and the backend
 * still answers, as it does for every other hidden part of the appeal work. A
 * hidden list has nothing in it anyway, and gating the route as well would make
 * a deep link fail while the feature request is still in flight.
 */
const useCaseTableGroups = (): CaseTableGroup[] => {
  const { user } = useContext(UserContext)
  const { features } = useContext(FeatureContext)

  // Memoised because the result is rebuilt from scratch every time - the groups
  // are mapped and their tables filtered, so nothing survives by identity.
  // Callers that memoise on it would otherwise never cache: SearchModal holds
  // the search string, so it renders on every keystroke.
  return useMemo(
    () => getVisibleCaseTableGroups(getCaseTableGroups(user), features),
    [user, features],
  )
}

export default useCaseTableGroups
