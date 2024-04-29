import React, { memo, useMemo } from 'react'

import { Icon, LinkV2 } from '@island.is/island-ui/core'
import { RegulationMaybeDiff, toISODate } from '@island.is/regulations'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'

import { RegulationPageTexts } from './RegulationTexts.types'
import { useRegulationLinkResolver } from './regulationUtils'
import * as s from './RegulationDisplay.css'

const useStepperState = (regulation: RegulationMaybeDiff) =>
  useMemo(() => {
    const {
      timelineDate,
      history: regulationHistory,
      lastAmendDate,
    } = regulation
    const history = regulationHistory.filter((h) => h.status === 'published')

    const changes = history.filter(({ effect }) => effect !== 'repeal')

    const numChanges = changes.length

    if (!numChanges) {
      return { numChanges }
    }

    const todayISO = toISODate(new Date())

    const currentPos = timelineDate
      ? changes.findIndex((change) => change.date === timelineDate)
      : changes.filter((change) => change.date <= todayISO).length - 1

    const nextDate = changes[currentPos + 1]?.date
    const previousDate =
      currentPos === 0 ? ('original' as const) : changes[currentPos - 1]?.date

    return {
      numChanges,
      nextDate: nextDate === lastAmendDate ? ('current' as const) : nextDate,
      previousDate:
        previousDate === lastAmendDate ? ('current' as const) : previousDate,
    }
  }, [regulation])

// ---------------------------------------------------------------------------

export type HistoryStepperProps = {
  regulation: RegulationMaybeDiff
  texts: RegulationPageTexts
}

export const HistoryStepper = memo((props: HistoryStepperProps) => {
  const txt = useNamespace(props.texts)
  const { linkToRegulation } = useRegulationLinkResolver()

  const { numChanges, nextDate, previousDate } = useStepperState(
    props.regulation,
  )
  const { name, showingDiff } = props.regulation

  if (!numChanges) {
    return null
  }

  const nextContent = (
    <>
      <span className={s.historyStepperLinkText}>{txt('nextVersion')}</span>{' '}
      <Icon icon="arrowForward" size="small" />
    </>
  )
  const prevContent = (
    <>
      <Icon icon="arrowBack" size="small" />{' '}
      <span className={s.historyStepperLinkText}>{txt('previousVersion')}</span>
    </>
  )

  return (
    <div className={s.historyStepper}>
      {nextDate ? (
        <LinkV2
          href={linkToRegulation(name, {
            diff: !!showingDiff,
            d: nextDate !== 'current' ? nextDate : undefined,
          })}
          className={s.historyStepperLink}
          color="blue400"
          underline="small"
        >
          {nextContent}
        </LinkV2>
      ) : (
        <span className={s.historyStepperLink} aria-hidden="true">
          {nextContent}
        </span>
      )}
      {'  '}
      {previousDate ? (
        <LinkV2
          href={linkToRegulation(name, {
            diff: !!showingDiff && previousDate !== 'original',
            ...(previousDate === 'original'
              ? { original: true }
              : previousDate !== 'current'
              ? { d: previousDate }
              : {}),
          })}
          color="blue400"
          className={s.historyStepperLink}
          underline="small"
        >
          {prevContent}
        </LinkV2>
      ) : (
        <span className={s.historyStepperLink} aria-hidden="true">
          {prevContent}
        </span>
      )}
    </div>
  )
})
