import { RegulationPageTexts, Regulation } from './mockData'

import * as s from './RegulationDisplay.treat'

import React, { FC, useMemo, useState } from 'react'
import { FocusableBox, Link, Stack, Text } from '@island.is/island-ui/core'
import { RegulationLayout } from './RegulationLayout'
import { prettyName, useRegulationLinkResolver } from './regulationUtils'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'
import { RegulationsSidebarBox } from './RegulationsSidebarBox'
import { useRouter } from 'next/router'
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
  originalBody?: string
  texts: RegulationPageTexts
}

export const RegulationDisplay: FC<RegulationDisplayProps> = (props) => {
  const { regulation, texts } = props
  const { history, effects } = regulation

  const router = useRouter()
  const dateUtl = useDateUtils()
  const [showDiff, setShowDiff] = useState(false)
  const formatDate = (isoDate: string) => {
    // Eff this! 👇
    // return dateUtl.format(new Date(isoDate), dateFormat[dateUtl.locale.code || defaultLanguage])
    return dateUtl.format(new Date(isoDate), dateFormat.is)
  }
  const n = useNamespace(texts)
  const { linkResolver, linkToRegulation } = useRegulationLinkResolver()

  const regulationBody = regulation.text

  console.log({ regulation })

  return (
    <RegulationLayout
      texts={props.texts}
      main={
        <>
          {history.length > 0 && (
            <button
              className={s.diffToggler}
              onClick={() => setShowDiff(!showDiff)}
            >
              {showDiff ? n('hideDiff') : n('showDiff')}
            </button>
          )}

          {!regulation.repealedDate ? (
            <Text>
              {!history.length ||
              regulation.timelineDate === regulation.lastAmendDate ? (
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
              ) : (
                <>
                  <Ball type="red" />
                  Úrelt útgáfa reglugerðar
                  {regulation.lastAmendDate ? (
                    <>
                      {' – '}
                      <span className={s.metaDate}>
                        síðast uppfærð {formatDate(regulation.lastAmendDate)}
                      </span>
                    </>
                  ) : (
                    ''
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
            {prettyName(regulation.name)} {regulation.title}
          </Text>
          <div
            className={s.bodyText}
            dangerouslySetInnerHTML={{ __html: regulationBody }}
          />
        </>
      }
      sidebar={
        <Stack space={2}>
          {effects.length > 0 && (
            <RegulationsSidebarBox
              title="Stofnreglugerð"
              colorScheme="blueberry"
            >
              {regulation.effects.slice(0, 1).map((item) => (
                <Link href={linkToRegulation(item.name)}>
                  <FocusableBox flexDirection={'column'}>
                    {({
                      isFocused,
                      isHovered,
                    }: {
                      isFocused: boolean
                      isHovered: boolean
                    }) => {
                      const textColor =
                        isFocused || isHovered ? 'blueberry400' : 'blueberry600'

                      return (
                        <>
                          <Text color={textColor} variant="h5" as="h3">
                            {prettyName(item.name)}
                          </Text>
                          <Text color={textColor}>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: item.title,
                              }}
                            />
                          </Text>
                        </>
                      )
                    }}
                  </FocusableBox>
                </Link>
              ))}
            </RegulationsSidebarBox>
          )}

          {history.length > 0 && (
            <RegulationsSidebarBox
              title={n('historyTitle') + ' ' + prettyName(regulation.name)}
              colorScheme="blueberry"
            >
              {regulation.history.map((item) => (
                <Link href={linkToRegulation(item.name) + '/d/' + item.date}>
                  <FocusableBox flexDirection={'column'}>
                    {({
                      isFocused,
                      isHovered,
                    }: {
                      isFocused: boolean
                      isHovered: boolean
                    }) => {
                      const textColor =
                        isFocused || isHovered ? 'blueberry400' : 'blueberry600'

                      return (
                        <>
                          <Text color={textColor} variant="h5" as="h4">
                            {prettyName(item.name)}
                          </Text>
                          <Text color={textColor} fontWeight="medium">
                            {item.date}
                          </Text>
                          <Text color={textColor}>{item.title}</Text>
                        </>
                      )
                    }}
                  </FocusableBox>
                </Link>
              ))}
            </RegulationsSidebarBox>
          )}

          <RegulationsSidebarBox title="Tengt efni" colorScheme="blueberry">
            <FocusableBox></FocusableBox>
          </RegulationsSidebarBox>
        </Stack>
      }
    />
  )
}
