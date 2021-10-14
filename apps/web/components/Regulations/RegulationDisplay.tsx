import * as s from './RegulationDisplay.treat'

import React, { useEffect, useState } from 'react'
import { ISODate, prettyName } from '@island.is/regulations'
import { RegulationMaybeDiff } from '@island.is/regulations/web'
import { RegulationPageTexts } from './RegulationTexts.types'
import { Button, Stack, Text, Hidden, Link } from '@island.is/island-ui/core'
import { Sticky } from '@island.is/web/components'
import { RegulationLayout } from './RegulationLayout'
import { useRegulationLinkResolver } from './regulationUtils'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'
import { RegulationStatus } from './RegulationStatus'
import { Appendixes } from './Appendixes'
import { HTMLBox } from '@island.is/regulations/react'
import { CommentsBox } from './CommentsBox'
import { Disclaimer } from './Disclaimer'
import { RegulationInfoBox } from './RegulationInfoBox'
import { RegulationEffectsBox } from './RegulationEffectsBox'
import { RegulationChangelog } from './RegulationChangelog'
import { AffectingRegulations } from './AffectingRegulations'
import { RegulationTimeline } from './RegulationTimeline'
import { DiffModeToggle } from './DiffModeToggle'
import { HistoryStepper } from './HistoryStepper'
import { useRegulationIndexer } from './useRegulationIndexer'
import { RegulationIndex } from './RegulationIndex'

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

let lastTxt: any

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

  const { index, text, appendixes } = useRegulationIndexer(regulation, txt)

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
                  html={regulation.title}
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
            <CommentsBox
              title={txt('commentsTitle')}
              content={regulation.comments}
            />
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
                  <Link href={linkResolver('regulationshome').href}>
                    {txt('goHome')}
                  </Link>
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
