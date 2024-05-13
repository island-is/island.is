import React, { Fragment, memo } from 'react'
import uniqBy from 'lodash/uniqBy'

import { LinkV2 } from '@island.is/island-ui/core'
import {
  interpolate,
  prettyName,
  RegulationMaybeDiff,
} from '@island.is/regulations'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'

import { RegulationPageTexts } from './RegulationTexts.types'
import { useDateUtils, useRegulationLinkResolver } from './regulationUtils'
import * as s from './RegulationDisplay.css'

export type AffectingRegulationsProps = {
  regulation: RegulationMaybeDiff
  texts: RegulationPageTexts
}

export const AffectingRegulations = memo((props: AffectingRegulationsProps) => {
  const { regulation, texts } = props
  const { showingDiff } = regulation

  const txt = useNamespace(texts)
  const { formatDate } = useDateUtils()
  const { linkToRegulation } = useRegulationLinkResolver()

  if (!showingDiff) {
    return null
  }

  const { from, to } = showingDiff

  const affectingRegulations = uniqBy(
    regulation.history.filter(
      ({ effect, date }) => effect === 'amend' && from <= date && date <= to,
    ),
    'name',
  )

  if (affectingRegulations.length === 0) {
    return null
  }

  const dates: string =
    from === to
      ? formatDate(to)
      : interpolate(txt('affectingLinkDateRange'), {
          dateFrom: formatDate(from),
          dateTo: formatDate(to),
        })

  const affectingLinksPrefix =
    (affectingRegulations.length > 1 && txt('affectingLinkPrefixPlural')) ||
    txt('affectingLinkPrefix')

  return (
    <div className={s.diffInfo}>
      {interpolate(affectingLinksPrefix, { dates }) + ' '}
      {affectingRegulations.map(({ name, title }, i) => {
        const separator =
          i === 0 ? '' : i === affectingRegulations.length - 1 ? ' og ' : ', '
        return (
          <Fragment key={i}>
            {separator}
            <LinkV2
              href={linkToRegulation(name)}
              color="blue400"
              underline="small"
            >
              <span title={title}>{prettyName(name)}</span>
            </LinkV2>
          </Fragment>
        )
      })}
    </div>
  )
})
