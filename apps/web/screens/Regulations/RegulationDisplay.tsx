import { Regulation, ISODate } from './Regulations.types'
import { RegulationPageTexts } from './Regulations.mock'

import * as s from './RegulationDisplay.treat'

import React, { FC, Fragment } from 'react'
import { FocusableBox, Link, Stack, Text } from '@island.is/island-ui/core'
import { RegulationLayout } from './RegulationLayout'
import {
  interpolate,
  prettyName,
  useRegulationLinkResolver,
} from './regulationUtils'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'
import { RegulationsSidebarBox } from './RegulationsSidebarBox'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { RegulationStatus } from './RegulationStatus'

// ---------------------------------------------------------------------------

export type RegulationDisplayProps = {
  regulation: Regulation
  urlDate?: ISODate
  texts: RegulationPageTexts
}

export const RegulationDisplay: FC<RegulationDisplayProps> = (props) => {
  const { regulation, texts } = props
  const { history, effects } = regulation

  const today = new Date().toISOString().substr(0, 10) as ISODate

  const dateUtl = useDateUtils()
  const formatDate = (isoDate: string) => {
    return dateUtl.format(new Date(isoDate), 'd. MMM yyyy')
  }
  const txt = useNamespace(texts)
  const { linkToRegulation } = useRegulationLinkResolver()

  const name = prettyName(regulation.name)

  const timelineItems = [
    {
      name: regulation.name,
      date: regulation.effectiveDate,
      // title: regulation.title,
      effect: 'root',
    } as const,
    ...history,
  ]

  const diffView = !!regulation.showingDiff
  const viewingOriginal = regulation.timelineDate === regulation.effectiveDate

  return (
    <RegulationLayout
      name={regulation.name}
      texts={props.texts}
      main={
        <>
          {history.length > 0 && !viewingOriginal && (
            <Link
              href={linkToRegulation(regulation.name, {
                diff: !diffView,
                ...(props.urlDate
                  ? { on: props.urlDate }
                  : regulation.timelineDate
                  ? { d: regulation.timelineDate }
                  : undefined),
              })}
              className={s.diffToggler}
            >
              {diffView ? txt('hideDiff') : txt('showDiff')}
            </Link>
          )}

          <RegulationStatus
            regulation={regulation}
            viewingOriginal={viewingOriginal}
            urlDate={props.urlDate}
            today={today}
          />

          <Text
            as="h1"
            variant="h3"
            marginTop={[2, 3, 4, 5]}
            marginBottom={[2, 4]}
          >
            {name} {regulation.title}
          </Text>
          <div
            className={s.bodyText}
            dangerouslySetInnerHTML={{ __html: regulation.text }}
          />
        </>
      }
      sidebar={
        <Stack space={2}>
          {effects.length > 0 && (
            <RegulationsSidebarBox
              title={interpolate(txt('effectsTitle'), { name })}
              colorScheme="blueberry"
            >
              {regulation.effects.map((item, i) => {
                const name = prettyName(item.name)
                const label = interpolate(
                  item.effect === 'amend'
                    ? txt('effectsChange')
                    : txt('effectsCancel'),
                  { name },
                )
                const labelLong = label + ' ' + item.title

                return (
                  <Link
                    key={'effects-' + i}
                    href={linkToRegulation(item.name)}
                    aria-label={labelLong}
                    title={labelLong}
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
                            isFocused || isHovered
                              ? 'blueberry400'
                              : 'blueberry600'
                          }
                        >
                          {label}
                        </Text>
                      )}
                    </FocusableBox>
                  </Link>
                )
              })}
            </RegulationsSidebarBox>
          )}

          {history.length > 0 && (
            <RegulationsSidebarBox
              title={interpolate(txt('historyTitle'), {
                name,
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

                const isTimelineActive = regulation.timelineDate === item.date

                const futureSplitter = item.date > today &&
                  (i === 0 || arr[i - 1].date <= today) && (
                    <Text variant="small">{txt('historyFutureSplitter')}:</Text>
                  )

                return (
                  <Fragment key={'history-' + i}>
                    {futureSplitter}
                    <Link
                      href={linkToRegulation(
                        regulation.name,
                        item.effect === 'root'
                          ? { original: true }
                          : { d: item.date, diff: true },
                      )}
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
                              isFocused || isHovered
                                ? 'blueberry400'
                                : 'blueberry600'
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
                                isFocused || isHovered
                                  ? 'blueberry400'
                                  : 'blueberry600'
                              }
                              fontWeight={
                                !regulation.timelineDate ? 'medium' : undefined
                              }
                            >
                              {!regulation.timelineDate && ' ▶︎ '}
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
          )}

          {
            <RegulationsSidebarBox
              title={txt('infoTitle', 'Upplýsingar')}
              colorScheme="blueberry"
            >
              {regulation.ministry && (
                <Text>
                  <strong>Ráðuneyti</strong>
                  <br />
                  {regulation.ministry.name}
                </Text>
              )}

              {regulation.lawChapters.length > 0 && (
                <Text>
                  <strong>Lagakaflar</strong>
                  <ul>
                    {regulation.lawChapters.map((chapter, i) => (
                      <li key={i}>{chapter.name}</li>
                    ))}
                  </ul>
                </Text>
              )}

              {regulation.effectiveDate && (
                <Text>
                  <strong>Tók gildi</strong>
                  <br />
                  {formatDate(regulation.effectiveDate)}
                </Text>
              )}

              {regulation.lastAmendDate && (
                <Text>
                  <strong>Síðast uppfærð</strong>
                  <br />
                  {formatDate(regulation.lastAmendDate)}
                </Text>
              )}
            </RegulationsSidebarBox>
          }
        </Stack>
      }
    />
  )
}
