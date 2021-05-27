import React, { Fragment, memo } from 'react'
import { Box, Link } from '@island.is/island-ui/core'
import { RegulationMaybeDiff } from './Regulations.types'
import { RegulationPageTexts } from './RegulationTexts.types'
import { uniqBy } from 'lodash'
import {
  interpolate,
  prettyName,
  useDomid,
  useRegulationLinkResolver,
} from './regulationUtils'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'
import { useDateUtils } from './regulationUtils'

export type AffectingRegulationsProps = {
  regulation: RegulationMaybeDiff
  texts: RegulationPageTexts
}

export const AffectingRegulations = memo((props: AffectingRegulationsProps) => {
  const { regulation, texts } = props
  const { showingDiff, history } = regulation

  const domid = useDomid()
  const txt = useNamespace(texts)
  const { formatDate } = useDateUtils()
  const { linkToRegulation } = useRegulationLinkResolver()

  if (!showingDiff) {
    return null
  }

  const { from, to } = showingDiff

  const affectingRegulations = uniqBy(
    regulation.history.filter(
      ({ effect, date }) => effect === 'amend' && from < date && date <= to,
    ),
    'name',
  )

  if (affectingRegulations.length === 0) {
    return null
  }

  let dates: string =
    from === to
      ? formatDate(to)
      : interpolate(txt('affectingLinkDateRange'), {
          dateFrom: formatDate(from),
          dateTo: formatDate(to),
        })

  return (
    <Box marginTop={3} marginBottom={3}>
      {interpolate(txt('affectingLinkPrefix'), { dates })}{' '}
      {affectingRegulations.map(({ name, title }, i) => {
        const separator =
          i === 0
            ? undefined
            : i === affectingRegulations.length - 1
            ? ' og '
            : ', '
        return (
          <Fragment key={i}>
            {separator}
            <Link
              href={linkToRegulation(name)}
              color="blue400"
              underline="small"
            >
              <span title={title}>{prettyName(name)}</span>
            </Link>
          </Fragment>
        )
      })}
    </Box>
  )
})
