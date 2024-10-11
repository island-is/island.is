import React, { useState } from 'react'

import { Button, Hidden, LinkV2, Stack, Text } from '@island.is/island-ui/core'
import {
  HTMLText,
  ISODate,
  prettyName,
  RegulationMaybeDiff,
} from '@island.is/regulations'
import { Sticky } from '@island.is/web/components'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'

import { AffectingRegulations } from './AffectingRegulations'
import { Appendixes } from './Appendixes'
import { CommentsBox } from './CommentsBox'
import { DiffModeToggle } from './DiffModeToggle'
import { Disclaimer } from './Disclaimer'
import { HistoryStepper } from './HistoryStepper'
import { HTMLBox } from './HTMLBox'
import { RegulationChangelog } from './RegulationChangelog'
import { RegulationEffectsBox } from './RegulationEffectsBox'
import { RegulationIndex } from './RegulationIndex'
import { RegulationInfoBox } from './RegulationInfoBox'
import { RegulationLayout } from './RegulationLayout'
import { RegulationStatus } from './RegulationStatus'
import { RegulationPageTexts } from './RegulationTexts.types'
import { RegulationTimeline } from './RegulationTimeline'
import { useRegulationLinkResolver } from './regulationUtils'
import { useRegulationIndexer } from './useRegulationIndexer'
import * as s from './RegulationDisplay.css'

// ---------------------------------------------------------------------------

const getKey = (regulation: RegulationMaybeDiff): string => {
  const { name, timelineDate, showingDiff } = regulation
  const { from, to } = showingDiff || {}
  return [name, timelineDate, from, to].join()
}

// ---------------------------------------------------------------------------

export type RegulationDisplayProps = {
  regulation: RegulationMaybeDiff
  urlDate?: ISODate
  texts: RegulationPageTexts
}

export const RegulationDisplay = (props: RegulationDisplayProps) => {
  const { regulation, texts, urlDate } = props

  const txt = useNamespace(texts)
  const { linkResolver } = useRegulationLinkResolver()

  const name = prettyName(regulation.name)

  const { timelineDate, lastAmendDate, repealedDate, repealed } = regulation

  const isRepealed = !!repealedDate
  const isOgildWAT = repealed && !repealedDate // Don't ask. Magic data!

  const isCurrent =
    (!isRepealed && !timelineDate) || timelineDate === lastAmendDate
  const isUpcoming =
    !isRepealed &&
    !isCurrent &&
    timelineDate &&
    lastAmendDate &&
    timelineDate > lastAmendDate

  const waterMarkClass = isRepealed
    ? s.repealedWarning
    : isOgildWAT
    ? s.ogildWatWarning
    : !isCurrent
    ? s.oudatedWarning + (isUpcoming ? ' ' + s.upcomingWarning : '')
    : undefined

  const key = getKey(regulation)

  const [showTimeline, setShowTimeline] = useState(false)

  const { index, text, appendixes, comments } = useRegulationIndexer(
    regulation,
    txt,
  )

  return (
    <RegulationLayout
      key={key}
      name={regulation.name}
      texts={props.texts}
      main={
        <>
          <div className={s.statusHeader}>
            <DiffModeToggle
              regulation={regulation}
              texts={texts}
              urlDate={urlDate}
            />
            <HistoryStepper regulation={regulation} texts={texts} />
            <RegulationStatus
              regulation={regulation}
              urlDate={props.urlDate}
              texts={texts}
            />
            <AffectingRegulations regulation={regulation} texts={texts} />
          </div>

          <div className={waterMarkClass}>
            <Text marginTop={[2, 3, 4, 5]} marginBottom={1}>
              <strong>{name}</strong>
            </Text>
            <Text as="h1" variant="h3" marginBottom={[2, 4]}>
              {regulation.showingDiff ? (
                <HTMLBox
                  component="span"
                  className={s.titleText + ' ' + s.diffText}
                  html={regulation.title as HTMLText}
                />
              ) : (
                <span className={s.titleText}>{regulation.title}</span>
              )}
            </Text>

            {index && <RegulationIndex index={index} txt={txt} />}

            <HTMLBox className={s.bodyText + ' ' + s.diffText} html={text} />
            <Appendixes
              legend={txt('appendixesTitle')}
              genericTitle={txt('appendixGenericTitle')}
              appendixes={appendixes}
              diffing={!!regulation.showingDiff}
            />
            <CommentsBox title={txt('commentsTitle')} content={comments} />
          </div>
          <Disclaimer
            title={txt('disclaimerTitle')}
            content={txt('disclaimerMd')}
          />
        </>
      }
      sidebar={
        <Sticky constantSticky>
          <div className={s.sidebarScroller}>
            <Stack space={3}>
              <Hidden print={true}>
                <Button
                  preTextIcon="arrowBack"
                  preTextIconType="filled"
                  size="small"
                  variant="text"
                >
                  <LinkV2 href={linkResolver('regulationshome').href}>
                    {txt('goHome')}
                  </LinkV2>
                </Button>
              </Hidden>

              <RegulationInfoBox regulation={regulation} texts={texts} />

              <Hidden print={true}>
                {showTimeline ? (
                  <RegulationTimeline regulation={regulation} texts={texts} />
                ) : (
                  <RegulationChangelog
                    key={regulation.name}
                    regulation={regulation}
                    texts={texts}
                  />
                )}
                <button
                  onClick={() => setShowTimeline(!showTimeline)}
                  {...((v) => ({
                    'aria-label': v,
                    title: v,
                  }))(showTimeline ? 'Birta tímalínu' : 'Birta breytinga logg')}
                  style={{ width: '100%', padding: '1em', cursor: 'pointer' }}
                />

                <RegulationEffectsBox regulation={regulation} texts={texts} />
              </Hidden>
            </Stack>
          </div>
        </Sticky>
      }
    />
  )
}
