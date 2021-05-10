import * as s from './MinistryTansfer.treat'
import { bodyText as bodyTextClass } from './RegulationDisplay.treat'

import React, { memo } from 'react'
import { RegulationMaybeDiff } from './Regulations.types'
import { RegulationPageTexts } from './RegulationTexts.types'
import { interpolateArray, prettyName } from './regulationUtils'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'

export type MinistryTransferProps = {
  regulation: RegulationMaybeDiff
  texts: RegulationPageTexts
}

export const MinistryTransfer = memo((props: MinistryTransferProps) => {
  const { regulation, texts } = props

  const txt = useNamespace(texts)
  // const { linkToRegulation } = useRegulationLinkResolver()

  if (!regulation.showingDiff || !regulation.prevMinistry) {
    return null
  }

  const { ministry, prevMinistry } = regulation

  if (ministry.slug === prevMinistry.slug) {
    return null
  }

  return (
    <div className={s.wrapper + ' ' + bodyTextClass}>
      {interpolateArray(txt('ministryTransfer'), {
        ministry: <ins key="ministry">{ministry.name}</ins>,
        prevMinistry: <del key="prevMinistry">{prevMinistry.name}</del>,
      })}
    </div>
  )
})
