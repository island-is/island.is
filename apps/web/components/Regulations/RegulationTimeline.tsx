import * as s from './RegulationsSidebarBox.treat'

import React from 'react'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'
import { RegulationMaybeDiff } from './Regulations.types'
import { RegulationsSidebarBox } from './RegulationsSidebarBox'
import { RegulationPageTexts } from './RegulationTexts.types'
import { useRegulationEffectPrepper } from './RegulationChangelog'

export type RegulationTimelineProps = {
  regulation: RegulationMaybeDiff
  texts: RegulationPageTexts
}

export const RegulationTimeline = (props: RegulationTimelineProps) => {
  const { regulation, texts } = props
  const txt = useNamespace(texts)

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
