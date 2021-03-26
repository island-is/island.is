import {
  RegulationPageTexts,
  Regulation,
  RegulationHistoryItem,
} from './mockData'

import * as s from './RegulationDisplay.treat'

import React, { FC, useMemo, useState } from 'react'
import {
  FocusableBox,
  Link,
  Stack,
  Text,
  Typography,
} from '@island.is/island-ui/core'
import { RegulationLayout } from './RegulationLayout'
import { prettyName, useRegulationLinkResolver } from './regulationUtils'
import { useNamespace } from '@island.is/web/hooks'
import { RegulationsSidebarBox } from './RegulationsSidebarBox'
import { useRouter } from 'next/router'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { dateFormat } from '@island.is/shared/constants'
import htmldiff from 'htmldiff-js'
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
  history: Array<RegulationHistoryItem>
  texts: RegulationPageTexts
}

export const RegulationDisplay: FC<RegulationDisplayProps> = (props) => {
  const { regulation, texts, originalBody, history } = props

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

  // TODO: move into getInitialProps triggered by route.
  const regulationText = 'text' in regulation ? regulation.text : ''
  const regulationBody = useMemo(
    () =>
      originalBody && showDiff
        ? htmldiff
            .execute(originalBody, regulationText)
            .replace(/<del [^>]+>\s+<\/del>/g, '')
            .replace(/<ins [^>]+>\s+<\/ins>/g, '')
        : regulationText,
    [showDiff, originalBody, regulationText],
  )

  return (
    <RegulationLayout
      texts={props.texts}
      main={
        <>
          {originalBody && (
            <button
              className={s.diffToggler}
              onClick={() => setShowDiff(!showDiff)}
            >
              {showDiff ? n('hideDiff') : n('showDiff')}
            </button>
          )}

          {!regulation.repealedDate ? (
            <Text>
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
        history.length > 0 && (
          <Stack space={2}>
            <RegulationsSidebarBox
              title="Stofnreglugerð"
              colorScheme="blueberry"
            >
              {history.slice(0, 1).map((item) => (
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
                          <Typography color={textColor} variant="h5" as="h3">
                            {prettyName(item.name)}
                          </Typography>
                          <Typography color={textColor} variant="p">
                            <span
                              dangerouslySetInnerHTML={{
                                __html: item.title,
                              }}
                            />
                          </Typography>
                        </>
                      )
                    }}
                  </FocusableBox>
                </Link>
              ))}
            </RegulationsSidebarBox>
            <RegulationsSidebarBox
              title={n('historyTitle') + ' ' + prettyName(regulation.name)}
              colorScheme="blueberry"
            >
              {history.map((item) => (
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
                          <Typography color={textColor} variant="h5" as="h3">
                            {prettyName(item.name)}
                          </Typography>
                          <Typography color={textColor} variant="p">
                            {item.title}
                          </Typography>
                        </>
                      )
                    }}
                  </FocusableBox>
                </Link>
              ))}
            </RegulationsSidebarBox>
            <RegulationsSidebarBox title="Tengt efni" colorScheme="blueberry">
              <FocusableBox></FocusableBox>
            </RegulationsSidebarBox>
          </Stack>
        )
      }
    />
  )
}
