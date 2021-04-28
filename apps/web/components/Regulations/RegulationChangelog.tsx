import React, { Fragment } from 'react'
import * as s from './RegulationsSidebarBox.treat'
import cn from 'classnames'
import { Text } from '@island.is/island-ui/core'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'
import { ISODate, RegulationMaybeDiff } from './Regulations.types'
import {
  RegulationsSidebarBox,
  RegulationsSidebarLink,
} from './RegulationsSidebarBox'
import { RegulationPageTexts } from './RegulationTexts.types'
import {
  interpolate,
  prettyName,
  useDateUtils,
  useRegulationLinkResolver,
} from './regulationUtils'

export type RegulationChangelogProps = {
  regulation: RegulationMaybeDiff
  texts: RegulationPageTexts
}

export const RegulationChangelog = (props: RegulationChangelogProps) => {
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
      // title: regulation.title,
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
      <RegulationsSidebarLink
        href={linkToRegulation(regulation.name)}
        current={viewingCurrent}
      >
        {viewingCurrent && ' ▶︎ '}
        {txt('historyCurrentVersion')}
      </RegulationsSidebarLink>

      {timelineItems.reverse().map((item, i, arr) => {
        const name = prettyName(item.name)

        const label = interpolate(
          i === arr.length - 1 // item.effect === 'root'
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

        const futureSplitter = item.date > today && i === 0 && (
          <Text variant="small" marginBottom={1}>
            {txt('historyFutureSplitter')}:
          </Text>
        )

        const pastSplitter = item.date <= today &&
          i > 0 &&
          arr[i - 1].date > today && (
            <Text variant="small" marginBottom={1}>
              {txt('historyPastSplitter', 'Gildandi breytingar')}:
            </Text>
          )

        return (
          <Fragment key={'history-' + i}>
            {futureSplitter || pastSplitter}

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
                  isTimelineActive && s.changelogCurrent,
                )}
                title={labelLong}
              >
                {label}
              </span>
            </RegulationsSidebarLink>
          </Fragment>
        )
      })}
    </RegulationsSidebarBox>
  )
}
