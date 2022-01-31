import React from 'react'
import { CreateImpact } from './impacts/CreateImpact'
import { useDraftingState } from '../state/useDraftingState'
import { EditCancellation } from './impacts/EditCancellation'
import { EditChange } from './impacts/EditChange'

// ---------------------------------------------------------------------------

export const EditImpacts = () => {
  const { draft, activeImpact } = useDraftingState()

  /*
    TODO: Fetch (when activeImpact is defined)
    The target (base) regulation and its future
    impacts (both incoming and outgoing)

    What we need to decide is how best to
    fetch and keep updated all the different impacts,
    how/where to group them by baseRegulation, etc. etc.

    DECIDE: if this should perhaps be fetched at the (root-)level
    in EditApp (in "../screens/Edit.tsx") and injected into the
    App-level state.
  */

  // const baseRegulationInfo = useBaseRegulationQuery(impactId)

  if (!activeImpact) {
    return <CreateImpact />
  }

  const impact = draft.impacts.find((i) => i.id === activeImpact)

  if (!impact) {
    throw new Error('No matching impact found')
  }
  if (impact.type === 'repeal') {
    return <EditCancellation cancellation={impact} />
  }
  return <EditChange change={impact} />
}
