import * as s from './RegulationStatus.treat'

import React from 'react'
import { ISODate, interpolate } from '@island.is/regulations'
import { RegulationMaybeDiff } from '@island.is/regulations/web'
import { Hidden, Link, Text } from '@island.is/island-ui/core'
import { useDateUtils, useRegulationLinkResolver } from './regulationUtils'
import { RegulationPageTexts } from './RegulationTexts.types'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'
import { Ball, BallColor } from './Ball'

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
    effectiveDate,
    repealedDate,
    history,
  } = regulation

  const today = new Date().toISOString().substr(0, 10) as ISODate

  const color: BallColor = repealedDate
    ? 'red'
    : type === 'amending'
    ? 'yellow'
    : !timelineDate || timelineDate === lastAmendDate
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
    const nextItem = idx > -1 && history[idx + 1]
    return nextItem ? nextItem.date : today // fall back to `today`, because whatever, It should never happen...
  }

  const renderLinkToCurrent = () => {
    const textKey = !repealedDate
      ? 'statusLinkToCurrent'
      : 'statusLinkToRepealed'
    const labelKey = !repealedDate
      ? 'statusLinkToCurrent_long'
      : 'statusLinkToRepealed_long'
    return (
      <small className={s.linkToCurrent}>
        <Link href={linkToRegulation(name)} aria-label={txt(labelKey)}>
          {txt(textKey)}
        </Link>
      </small>
    )
  }

  return (
    <>
      <div className={s.printText}>
        <Text>
          {txt('printedDate')} {formatDate(today)}
        </Text>
      </div>
      <Text>
        <Ball type={color} />

        {!timelineDate || timelineDate === lastAmendDate ? (
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
                {interpolate(txt('statusUpcoming_on'), {
                  date: formatDate(timelineDate),
                })}
              </small>
            )}{' '}
            {renderLinkToCurrent()}
          </>
        ) : (
          <>
            {txt(
              timelineDate === effectiveDate
                ? 'statusOriginal'
                : 'statusHistoric',
            ) + ' '}
            {onDateText || (
              <small className={s.metaDate}>
                {interpolate(txt('statusHistoric_period'), {
                  dateFrom: formatDate(timelineDate),
                  dateTo: formatDate(getNextHistoryDate()),
                })}
              </small>
            )}{' '}
            {renderLinkToCurrent()}
          </>
        )}
      </Text>
    </>
  )
}
