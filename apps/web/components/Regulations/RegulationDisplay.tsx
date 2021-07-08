import * as s from './RegulationDisplay.treat'

import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { ISODate, prettyName } from '@island.is/regulations'
import { RegulationMaybeDiff } from '@island.is/regulations/web'
import { RegulationPageTexts } from './RegulationTexts.types'
import {
  Button,
  Stack,
  Text,
  ToggleSwitchLink,
  Hidden,
} from '@island.is/island-ui/core'
import { Sticky } from '@island.is/web/components'
import { RegulationLayout } from './RegulationLayout'
import { useRegulationLinkResolver } from './regulationUtils'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'
import { RegulationStatus } from './RegulationStatus'
import { Appendixes } from './Appendixes'
import { HTMLBox } from '@island.is/regulations/react'
import { CommentsBox } from './CommentsBox'
import { RegulationInfoBox } from './RegulationInfoBox'
import { RegulationEffectsBox } from './RegulationEffectsBox'
import { RegulationChangelog } from './RegulationChangelog'
import { AffectingRegulations } from './AffectingRegulations'
import { RegulationTimeline } from './RegulationTimeline'
import { MinistryTransfer } from './MinistryTansfer'
import { Link } from '@island.is/island-ui/core'

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
  const router = useRouter()
  const { regulation, texts } = props

  const txt = useNamespace(texts)
  const { linkToRegulation, linkResolver } = useRegulationLinkResolver()

  const name = prettyName(regulation.name)

  const {
    timelineDate,
    effectiveDate,
    lastAmendDate,
    repealedDate,
    showingDiff,
  } = regulation

  const diffView = !!showingDiff

  const isDiffable =
    regulation.history.length > 0 && timelineDate !== effectiveDate

  const isRepealed = !!repealedDate
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
    : !isCurrent
    ? s.oudatedWarning + (isUpcoming ? ' ' + s.upcomingWarning : '')
    : undefined

  const diffIsAgainstOriginal =
    !!showingDiff && showingDiff.from === regulation.history[0].date

  const key = getKey(regulation)

  const [showTimeline, setShowTimeline] = useState(false)

  return (
    <RegulationLayout
      name={regulation.name}
      texts={props.texts}
      main={
        <>
          <div className={s.statusHeader}>
            {isDiffable && (
              <div className={s.diffTogglerWrap}>
                <ToggleSwitchLink
                  className={s.diffToggler}
                  checked={diffView}
                  href={linkToRegulation(regulation.name, {
                    diff: !diffView,
                    ...(props.urlDate
                      ? { on: props.urlDate }
                      : timelineDate
                      ? { d: timelineDate }
                      : !diffView
                      ? { d: lastAmendDate }
                      : undefined),
                  })}
                  scroll={false}
                  linkText={diffView ? txt('hideDiff') : txt('showDiff')}
                  label={txt('showDiff')}
                />
                {diffView && (
                  <div className={s.diffTotalToggler}>
                    {diffIsAgainstOriginal ? (
                      <Link
                        href={linkToRegulation(regulation.name, {
                          diff: true,
                          ...(props.urlDate
                            ? { on: props.urlDate }
                            : { d: timelineDate || lastAmendDate }),
                        })}
                        color="blue400"
                        underline="small"
                      >
                        {txt('showDiff_fromLast')}
                      </Link>
                    ) : (
                      <Link
                        href={linkToRegulation(regulation.name, {
                          diff: true,
                          ...(props.urlDate
                            ? { on: props.urlDate, earlierDate: 'original' }
                            : timelineDate
                            ? { d: timelineDate, earlierDate: 'original' }
                            : undefined),
                        })}
                        color="blue400"
                        underline="small"
                      >
                        {txt('showDiff_fromOriginal')}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}
            <RegulationStatus
              regulation={regulation}
              urlDate={props.urlDate}
              texts={texts}
            />
            <AffectingRegulations regulation={regulation} texts={texts} />
          </div>
          <MinistryTransfer regulation={regulation} texts={texts} />

          <div className={waterMarkClass}>
            <Text marginTop={[2, 3, 4, 5]} marginBottom={1}>
              <strong>{name}</strong>
            </Text>
            <Text as="h1" variant="h3" marginBottom={[2, 4]}>
              {regulation.showingDiff ? (
                <HTMLBox
                  component="span"
                  className={s.bodyText}
                  html={regulation.title}
                />
              ) : (
                regulation.title
              )}
            </Text>

            <HTMLBox className={s.bodyText} html={regulation.text} />

            <Appendixes
              key={key}
              legend={txt('appendixesTitle')}
              genericTitle={txt('appendixGenericTitle')}
              appendixes={regulation.appendixes}
              diffing={!!regulation.showingDiff}
            />

            <CommentsBox
              title={txt('commentsTitle')}
              content={regulation.comments}
            />
          </div>
        </>
      }
      sidebar={
        <Sticky>
          <Stack space={3}>
            <Hidden print={true}>
              <Button
                preTextIcon="arrowBack"
                preTextIconType="filled"
                size="small"
                type="button"
                variant="text"
                onClick={() => {
                  window.history.length > 2
                    ? router.back()
                    : router.push(linkResolver('regulationshome').href)
                }}
              >
                {txt('goBack')}
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
        </Sticky>
      }
    />
  )
}
