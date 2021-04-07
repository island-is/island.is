import {
  RegulationPageTexts,
  Regulation,
  ISODate,
  RegulationHistoryItem,
} from './mockData'

import * as s from './RegulationDisplay.treat'

import React, { FC, Fragment, useMemo, useState } from 'react'
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
import { dateFormat } from '@island.is/shared/constants'
import cn from 'classnames'

// ---------------------------------------------------------------------------

type BallProps = {
  type?: 'green' | 'red'
}
const Ball: React.FC<BallProps> = ({ type, children }) => (
  <span className={cn(s.ball, type === 'red' && s.ballRed)}>{children}</span>
)

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
    // Eff this! 👇
    // return dateUtl.format(new Date(isoDate), dateFormat[dateUtl.locale.code || defaultLanguage])
    return dateUtl.format(new Date(isoDate), dateFormat.is)
  }
  const txt = useNamespace(texts)
  const { linkToRegulation } = useRegulationLinkResolver()

  const regulationBody = regulation.text
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

  console.log('FOOBAR', {
    effectiveDate: regulation.effectiveDate,
    timelineDate: regulation.timelineDate,
    showingDiff: regulation.showingDiff || null,
  })

  const diffView = !!regulation.showingDiff

  return (
    <RegulationLayout
      name={regulation.name}
      texts={props.texts}
      main={
        <>
          {history.length > 0 && (
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

          {!regulation.repealedDate ? (
            <Text>
              {!regulation.timelineDate ? (
                <>
                  <Ball type="green" />
                  Núgildandi reglugerð
                  {regulation.lastAmendDate ? (
                    <>
                      {' – '}
                      <span className={s.metaDate}>
                        uppfærð {formatDate(regulation.lastAmendDate)}
                      </span>
                    </>
                  ) : (
                    ''
                  )}
                </>
              ) : regulation.timelineDate > today ? (
                <>
                  <Ball type="red" />
                  Væntanleg útgáfa reglugerðar
                  {' – '}
                  <span className={s.metaDate}>
                    sem mun taka gildi þann{' '}
                    {formatDate(regulation.timelineDate)}
                  </span>
                </>
              ) : (
                <>
                  <Ball type="red" />
                  Úrelt útgáfa reglugerðar
                  {' – '}
                  {props.urlDate ? (
                    <span className={s.metaDate}>
                      eins og leit út þann {formatDate(props.urlDate)}
                    </span>
                  ) : (
                    <span className={s.metaDate}>
                      sem tók gildi þann {formatDate(regulation.timelineDate)}
                    </span>
                  )}
                </>
              )}
            </Text>
          ) : (
            <Text>
              <Ball type="red" />
              Úrelt reglugerð{' – '}
              <span className={s.metaDate}>
                felld úr gildi {formatDate(regulation.repealedDate)}
              </span>
            </Text>
          )}
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
              {regulation.effects.slice(0, 1).map((item, i) => {
                const name = prettyName(item.name) + ' ' + item.title
                const label = interpolate(
                  item.effect === 'amend'
                    ? txt('effectsChange')
                    : txt('effectsCancel'),
                  { name },
                )

                return (
                  <Link key={'effects-' + i} href={linkToRegulation(item.name)}>
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
        </Stack>
      }
    />
  )
}
