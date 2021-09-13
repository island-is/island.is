import React from 'react'
import { RegulationMaybeDiff } from '@island.is/regulations/web'
import { RegulationsSidebarBox } from './RegulationsSidebarBox'
import { RegulationPageTexts } from './RegulationTexts.types'
import { useRegulationEffectPrepper } from './RegulationChangelog'

export type RegulationTimelineProps = {
  regulation: RegulationMaybeDiff
  texts: RegulationPageTexts
}

export const RegulationTimeline = (props: RegulationTimelineProps) => {
  const { regulation } = props

  const {
    boxTitle,
    // hasPastEffects,
    hasFutureEffects,
    renderCurrentVersion,
    // renderPastSplitter,
    renderPastEffects,
    renderOriginalVersion,
    renderFutureSplitter,
    renderFutureEffects,
  } = useRegulationEffectPrepper(props)

  if (!regulation.history.length) {
    return null
  }

  return (
    <RegulationsSidebarBox title={boxTitle}>
      {renderOriginalVersion()}
      {renderPastEffects()}
      {renderCurrentVersion()}
      {hasFutureEffects && renderFutureSplitter()}
      {renderFutureEffects()}
    </RegulationsSidebarBox>
  )
}
