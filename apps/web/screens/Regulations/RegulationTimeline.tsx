import React, { FC, Fragment } from 'react'
import { FocusableBox, Link, Text } from '@island.is/island-ui/core'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'
import { ISODate, RegulationMaybeDiff } from './Regulations.types'
import { RegulationsSidebarBox } from './RegulationsSidebarBox'
import { RegulationPageTexts } from './RegulationTexts.types'
import {
  interpolate,
  prettyName,
  useDateUtils,
  useRegulationLinkResolver,
} from './regulationUtils'

export type RegulationTimelineProps = {
  regulation: RegulationMaybeDiff
  texts: RegulationPageTexts
}

export const RegulationTimeline: FC<RegulationTimelineProps> = (props) => {
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
      colorScheme="blueberry"
    >
      {timelineItems.map((item, i, arr) => {
        const name = prettyName(item.name)
        const isCurrentVersion =
          item.date <= today &&
          item.effect === 'amend' &&
          (i === arr.length - 1 || arr[i + 1].date > today)

        const label = interpolate(
          i === 0 // item.effect === 'root'
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
            <Text variant="small">{txt('historyFutureSplitter')}:</Text>
          )

        return (
          <Fragment key={'history-' + i}>
            {futureSplitter}
            <Link
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
            >
              <FocusableBox flexDirection={'column'}>
                {({
                  isFocused,
                  isHovered,
                }: {
                  isFocused: boolean
                  isHovered: boolean
                }) => (
                  <Text
                    color={
                      isFocused || isHovered ? 'blueberry400' : 'blueberry600'
                    }
                    fontWeight={isTimelineActive ? 'medium' : undefined}
                  >
                    {isTimelineActive && ' ▶︎ '}
                    <strong>{formatDate(item.date)}</strong>
                    <br />
                    <span title={labelLong}>{label}</span>
                  </Text>
                )}
              </FocusableBox>
            </Link>

            {isCurrentVersion && (
              <Link href={linkToRegulation(regulation.name)}>
                <FocusableBox flexDirection={'column'}>
                  {({
                    isFocused,
                    isHovered,
                  }: {
                    isFocused: boolean
                    isHovered: boolean
                  }) => (
                    <Text
                      color={
                        isFocused || isHovered ? 'blueberry400' : 'blueberry600'
                      }
                      fontWeight={viewingCurrent ? 'medium' : undefined}
                    >
                      {viewingCurrent && ' ▶︎ '}
                      {txt('historyCurrentVersion')}
                    </Text>
                  )}
                </FocusableBox>
              </Link>
            )}
          </Fragment>
        )
      })}
    </RegulationsSidebarBox>
  )
}
