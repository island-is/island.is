import React, { Fragment, memo } from 'react'
import {
  Accordion,
  AccordionItem,
  Box,
  Bullet,
  BulletList,
  Link,
} from '@island.is/island-ui/core'
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

  const affectingRegulations = showingDiff
    ? uniqBy(
        regulation.history.filter(
          ({ effect, date }) =>
            effect === 'amend' &&
            showingDiff.from < date &&
            date <= showingDiff.to,
        ),
        'name',
      )
    : []

  if (affectingRegulations.length === 0) {
    return null
  }

  return (
    <Box marginTop={3} marginBottom={3}>
      {affectingRegulations.length === 1 ? (
        affectingRegulations.map(({ name, title }, i) => (
          <Fragment key={i}>
            {txt('affectingLinkPrefix')}{' '}
            <Link
              key={i}
              href={linkToRegulation(name)}
              color="blue400"
              underline="small"
            >
              {prettyName(name)} {title}
            </Link>
          </Fragment>
        ))
      ) : (
        <Accordion>
          <AccordionItem
            id={domid}
            label={txt('affectingListLegend')}
            labelVariant="h5"
          >
            <BulletList>
              {affectingRegulations.map(({ name, title }, i) => (
                <Bullet key={i}>
                  <Link
                    href={linkToRegulation(name)}
                    color="blue400"
                    underline="small"
                  >
                    {prettyName(name)} {title}
                  </Link>
                </Bullet>
              ))}
            </BulletList>
          </AccordionItem>
        </Accordion>
      )}
    </Box>
  )
})
