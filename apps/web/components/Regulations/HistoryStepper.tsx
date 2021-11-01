import * as s from './RegulationDisplay.css'

import React, { memo, useMemo } from 'react'
import { Icon, Link } from '@island.is/island-ui/core'
import { RegulationMaybeDiff } from '@island.is/regulations/web'
import { RegulationPageTexts } from './RegulationTexts.types'
import { useRegulationLinkResolver } from './regulationUtils'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'

const useStepperState = (regulation: RegulationMaybeDiff) =>
  useMemo(() => {
    const { timelineDate, history } = regulation

    const changes = history.filter(({ effect }) => effect !== 'repeal')

    const numChanges = changes.length

    if (!numChanges) {
      return { numChanges }
    }

    const currentPos = timelineDate
      ? changes.findIndex((change) => change.date === timelineDate)
      : numChanges - 1

    const nextDate = changes[currentPos + 1]?.date
    const previousDate =
      currentPos === 0 ? ('original' as const) : changes[currentPos - 1]?.date

    return {
      numChanges,
      nextDate,
      previousDate,
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
        <Link
          href={linkToRegulation(name, {
            diff: !!showingDiff,
            d: nextDate,
          })}
          className={s.historyStepperLink}
          color="blue400"
          underline="small"
        >
          {nextContent}
        </Link>
      ) : (
        <span className={s.historyStepperLink} aria-hidden="true">
          {nextContent}
        </span>
      )}
      {'  '}
      {previousDate ? (
        <Link
          href={linkToRegulation(name, {
            diff: !!showingDiff && previousDate !== 'original',
            ...(previousDate === 'original'
              ? { original: true }
              : { d: previousDate }),
          })}
          color="blue400"
          className={s.historyStepperLink}
          underline="small"
        >
          {prevContent}
        </Link>
      ) : (
        <span className={s.historyStepperLink} aria-hidden="true">
          {prevContent}
        </span>
      )}
    </div>
  )
})
