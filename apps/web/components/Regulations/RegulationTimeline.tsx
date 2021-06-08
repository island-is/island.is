import * as s from './RegulationsSidebarBox.treat'

import React, { Fragment } from 'react'
import cn from 'classnames'
import { Text } from '@island.is/island-ui/core'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'
import { ISODate, interpolate, prettyName } from '@island.is/regulations'
import { RegulationMaybeDiff } from '@island.is/regulations/web'
import {
  RegulationsSidebarBox,
  RegulationsSidebarLink,
} from './RegulationsSidebarBox'
import { RegulationPageTexts } from './RegulationTexts.types'
import { useDateUtils, useRegulationLinkResolver } from './regulationUtils'

export type RegulationTimelineProps = {
  regulation: RegulationMaybeDiff
  texts: RegulationPageTexts
}

export const RegulationTimeline = (props: RegulationTimelineProps) => {
  const { regulation, texts } = props
  const txt = useNamespace(texts)
  const { formatDate } = useDateUtils()
  const { linkToRegulation } = useRegulationLinkResolver()

  if (!regulation.history.length) {
    return null
  }

  const timelineItems = [
    {
      name: regulation.name,
      date: regulation.effectiveDate,
      effect: 'root',
    } as const,
    ...regulation.history,
  ]

  const today = new Date().toISOString().substr(0, 10) as ISODate

  const viewingCurrent =
    !regulation.timelineDate &&
    (!regulation.showingDiff ||
      regulation.showingDiff.from <= regulation.effectiveDate)

  return (
    <RegulationsSidebarBox
      title={interpolate(txt('historyTitle'), {
        name: regulation.name,
      })}
    >
      {timelineItems.map((item, i, arr) => {
        const name = prettyName(item.name)
        const isCurrentVersion =
          item.date <= today &&
          item.effect === 'amend' &&
          (i === arr.length - 1 || arr[i + 1].date > today)

        const label = interpolate(
          i === 0 // NOTE: item.effect === 'root'
            ? txt('historyStart')
            : item.effect === 'amend'
            ? txt('historyChange')
            : txt('historyCancel'),
          { name },
        )
        const labelLong =
          item.effect !== 'root' ? label + ' ' + item.title : undefined

        const isTimelineActive =
          (regulation.timelineDate ||
            (!viewingCurrent && regulation.lastAmendDate)) === item.date

        const futureSplitter = item.date > today &&
          (i === 0 || arr[i - 1].date <= today) && (
            <Text variant="small" marginBottom={1}>
              {txt('historyFutureSplitter')}:
            </Text>
          )

        return (
          <Fragment key={'history-' + i}>
            {futureSplitter}

            <RegulationsSidebarLink
              href={
                item.effect === 'root'
                  ? linkToRegulation(regulation.name, {
                      original: true,
                    })
                  : item.effect === 'repeal'
                  ? linkToRegulation(item.name)
                  : linkToRegulation(regulation.name, {
                      d: item.date,
                      diff: true,
                    })
              }
              current={isTimelineActive}
            >
              <strong>{formatDate(item.date)}</strong>
              <br />
              <span
                className={cn(
                  s.smallText,
                  isTimelineActive && s.timelineCurrent,
                )}
                title={labelLong}
              >
                {label}
              </span>
            </RegulationsSidebarLink>

            {isCurrentVersion && (
              <RegulationsSidebarLink
                href={linkToRegulation(regulation.name)}
                current={viewingCurrent}
                className={s.timelineCurrentVersion}
              >
                <span className={cn(viewingCurrent && s.timelineCurrent)}>
                  {txt('historyCurrentVersion')}
                </span>
              </RegulationsSidebarLink>
            )}
          </Fragment>
        )
      })}
    </RegulationsSidebarBox>
  )
}
