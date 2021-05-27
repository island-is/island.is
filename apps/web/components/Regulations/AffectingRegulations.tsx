import React, { Fragment, memo } from 'react'
import { Box, Link } from '@island.is/island-ui/core'
import { RegulationMaybeDiff } from './Regulations.types'
import { RegulationPageTexts } from './RegulationTexts.types'
import { uniqBy } from 'lodash'
import {
  prettyName,
  useDomid,
  useRegulationLinkResolver,
} from './regulationUtils'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'

export type AffectingRegulationsProps = {
  regulation: RegulationMaybeDiff
  texts: RegulationPageTexts
}

export const AffectingRegulations = memo((props: AffectingRegulationsProps) => {
  const { regulation, texts } = props
  const { showingDiff, history } = regulation

  const domid = useDomid()
  const txt = useNamespace(texts)
  const { linkToRegulation } = useRegulationLinkResolver()

  if (!showingDiff) {
    return null
  }

  const affectingRegulations = uniqBy(
    regulation.history.filter(
      ({ effect, date }) =>
        effect === 'amend' && showingDiff.from < date && date <= showingDiff.to,
    ),
    'name',
  )

  if (affectingRegulations.length === 0) {
    return null
  }

  return (
    <Box marginTop={3} marginBottom={3}>
      {txt('affectingLinkPrefix')}{' '}
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
