import React from 'react'

import { LinkV2, Text } from '@island.is/island-ui/core'
import {
  interpolate,
  ISODate,
  RegulationMaybeDiff,
  toISODate,
} from '@island.is/regulations'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'

import { Ball, BallColor } from './Ball'
import { RegulationPageTexts } from './RegulationTexts.types'
import { useDateUtils, useRegulationLinkResolver } from './regulationUtils'
import * as s from './RegulationStatus.css'

// ---------------------------------------------------------------------------

export type RegulationStatusProps = {
  regulation: RegulationMaybeDiff
  urlDate?: ISODate
  texts: RegulationPageTexts
}

export const RegulationStatus = (props: RegulationStatusProps) => {
  const { regulation, urlDate, texts } = props
  const { formatDate } = useDateUtils()
  const txt = useNamespace(texts)
  const { linkToRegulation } = useRegulationLinkResolver()

  const {
    type,
    name,
    timelineDate,
    lastAmendDate,
    publishedDate,
    repealed,
    repealedDate,
    history,
  } = regulation

  const today = toISODate(new Date())

  const hasPending = history.some((item) => item.status === 'pending')

  const color: BallColor = repealed
    ? 'red'
    : hasPending || type === 'amending'
    ? 'yellow'
    : !timelineDate || timelineDate === (lastAmendDate || publishedDate)
    ? 'green'
    : 'yellow'

  const onDateText = urlDate && (
    <small className={s.metaDate}>
      {interpolate(
        txt(urlDate > today ? 'statusOnDate_future' : 'statusOnDate_past'),
        { date: formatDate(urlDate) },
      )}
    </small>
  )

  const getNextHistoryDate = () => {
    const idx = (history || []).findIndex((item) => item.date === timelineDate)
    const nextItem =
      idx > -1
        ? history[idx + 1]
        : idx === -1 && history.length
        ? history[0]
        : false
    return nextItem ? nextItem.date : undefined
  }

  const renderLinkToCurrent = () => {
    const textKey = repealed ? 'statusLinkToRepealed' : 'statusLinkToCurrent'
    const labelKey = repealed
      ? 'statusLinkToRepealed_long'
      : 'statusLinkToCurrent_long'
    return (
      <small className={s.toCurrent}>
        <LinkV2
          className={s.linkToCurrent}
          href={linkToRegulation(name)}
          aria-label={txt(labelKey)}
        >
          {txt(textKey)}
        </LinkV2>
      </small>
    )
  }

  const isOgildWAT = repealed && !repealedDate // Don't ask. Magic data!

  const futureDateTo =
    timelineDate && timelineDate > today && getNextHistoryDate()

  return (
    <>
      <div className={s.printText}>
        <Text>
          {txt('printedDate')} {formatDate(today)}
        </Text>
      </div>
      <div className={s.statusText}>
        <Ball type={color} />

        {!timelineDate || timelineDate === (lastAmendDate || publishedDate) ? (
          repealedDate ? (
            <>
              {txt('statusRepealed') + ' '}
              {onDateText || (
                <small className={s.metaDate}>
                  {interpolate(txt('statusRepealed_on'), {
                    date: formatDate(repealedDate),
                  })}
                </small>
              )}
            </>
          ) : isOgildWAT ? (
            <>
              {txt('statusOgildWat') + ' '}
              {onDateText ||
                (lastAmendDate && (
                  <small className={s.metaDate}>
                    {interpolate(txt('statusCurrent_amended'), {
                      date: formatDate(lastAmendDate),
                    })}
                  </small>
                ))}
            </>
          ) : hasPending ? (
            <>
              {txt(
                type === 'base' ? 'statusCurrentBase' : 'statusCurrentAmending',
              ) + ' '}
              <small className={s.metaDate}>
                {txt(
                  'statusHasPending',
                  'Reglugerð án breytinga, sjá breytingasögu.',
                )}
              </small>
            </>
          ) : !lastAmendDate ? (
            <>
              {txt(
                type === 'base' ? 'statusCurrentBase' : 'statusCurrentAmending',
              ) + ' '}
              {onDateText}
            </>
          ) : (
            <>
              {txt('statusCurrentUpdated') + ' '}
              {onDateText ||
                (lastAmendDate && (
                  <small className={s.metaDate}>
                    {interpolate(txt('statusCurrent_amended'), {
                      date: formatDate(lastAmendDate),
                    })}
                  </small>
                ))}
            </>
          )
        ) : timelineDate > today ? (
          <>
            {txt('statusUpcoming') + ' '}
            {onDateText || (
              <small className={s.metaDate}>
                {!futureDateTo
                  ? interpolate(txt('statusUpcoming_on'), {
                      date: formatDate(timelineDate),
                    })
                  : interpolate(txt('statusUpcoming_period'), {
                      dateFrom: formatDate(timelineDate),
                      dateTo: futureDateTo,
                    })}
              </small>
            )}{' '}
            {renderLinkToCurrent()}
          </>
        ) : (
          <>
            {txt(
              timelineDate === publishedDate
                ? 'statusOriginal'
                : 'statusHistoric',
            ) + ' '}
            {onDateText || (
              <small className={s.metaDate}>
                {interpolate(txt('statusHistoric_period'), {
                  dateFrom: formatDate(timelineDate),
                  dateTo: formatDate(getNextHistoryDate() || today),
                })}
              </small>
            )}{' '}
            {renderLinkToCurrent()}
          </>
        )}
      </div>
    </>
  )
}
