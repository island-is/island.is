import * as s from './RegulationPage.treat'

import {
  exampleRegulation,
  exampleRegulationOriginalBody,
  regulationPageTexts,
  regulationHistory,
  Regulation,
  RegulationHistoryItem,
  RegulationRedirect,
  exampleRegulationRedirect,
} from './mockData'

import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { Screen } from '@island.is/web/types'
import { withMainLayout } from '@island.is/web/layouts/main'
// import getConfig from 'next/config'
// import { CustomNextError } from '@island.is/web/units/errors'
import { SubpageLayout } from '@island.is/web/screens/Layouts/Layouts'
import {
  Box,
  Breadcrumbs,
  FocusableBox,
  GridColumn,
  GridContainer,
  GridRow,
  Link,
  Stack,
  Text,
  Typography,
} from '@island.is/island-ui/core'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { dateFormat } from '@island.is/shared/constants'
import { prettyName, useRegulationLinkResolver } from './regulationUtils'
import htmldiff from 'htmldiff-js'
import cn from 'classnames'
import { RegulationsSidebarBox } from './RegulationsSidebarBox'

// const { publicRuntimeConfig } = getConfig()

// ---------------------------------------------------------------------------

type BallProps = {
  type?: 'green' | 'red'
}
const Ball: React.FC<BallProps> = ({ type, children }) => (
  <span className={cn(s.ball, type === 'red' && s.ballRed)}>{children}</span>
)

// ---------------------------------------------------------------------------

type RegulationPageProps = {
  regulation: Regulation | RegulationRedirect
  originalBody?: string
  history: Array<RegulationHistoryItem>
  texts: typeof regulationPageTexts
}

const RegulationPage: Screen<RegulationPageProps> = (props) => {
  const { regulation, originalBody, history } = props
  const router = useRouter()
  const dateUtl = useDateUtils()
  const [showDiff, setShowDiff] = useState(false)
  const formatDate = (isoDate: string) => {
    // Eff this! 👇
    // return dateUtl.format(new Date(isoDate), dateFormat[dateUtl.locale.code || defaultLanguage])
    return dateUtl.format(new Date(isoDate), dateFormat.is)
  }
  const n = useNamespace(props.texts)
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

  const breadCrumbs = (
    <Box display={['none', 'none', 'block']} marginBottom={4}>
      {/* Show when NOT a device */}
      <Breadcrumbs
        items={[
          {
            title: n('crumbs_1'),
            href: linkResolver('homepage').href,
          },
          {
            title: n('crumbs_2'),
            href: linkResolver('article').href,
          },
          {
            title: n('crumbs_3'),
            href: linkResolver('regulationshome').href,
          },
        ]}
      />
    </Box>
  )

  return (
    <SubpageLayout
      main={
        <Box paddingTop={[0, 0, 8]} paddingBottom={12}>
          <GridContainer>
            <GridRow>
              <GridColumn
                span={['1/1', '1/1', '1/1', '9/12', '8/12']}
                offset={['0', '0', '0', '0', '1/12']}
                order={1}
              >
                {breadCrumbs}

                {'redirectUrl' in regulation ? (
                  <>
                    <Text
                      as="h1"
                      variant="h3"
                      marginTop={[2, 3, 4, 5]}
                      marginBottom={[2, 4]}
                    >
                      {prettyName(regulation.name)} {regulation.title}
                    </Text>
                    <Text>
                      {n('redirectText')}
                      <br />
                      <a
                        href={regulation.redirectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {regulation.redirectUrl}
                      </a>
                    </Text>
                  </>
                ) : (
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
                )}
              </GridColumn>

              <GridColumn
                span={['1/1', '1/1', '1/1', '3/12']}
                order={[1, 1, 0]}
              >
                {history.length > 0 && (
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
                                isFocused || isHovered
                                  ? 'blueberry400'
                                  : 'blueberry600'

                              return (
                                <>
                                  <Typography
                                    color={textColor}
                                    variant="h5"
                                    as="h3"
                                  >
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
                      title={
                        n('historyTitle') + ' ' + prettyName(regulation.name)
                      }
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
                                isFocused || isHovered
                                  ? 'blueberry400'
                                  : 'blueberry600'

                              return (
                                <>
                                  <Typography
                                    color={textColor}
                                    variant="h5"
                                    as="h3"
                                  >
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
                    <RegulationsSidebarBox
                      title="Tengt efni"
                      colorScheme="blueberry"
                    >
                      <FocusableBox></FocusableBox>
                    </RegulationsSidebarBox>
                  </Stack>
                )}
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
      }
    />
  )
}

RegulationPage.getInitialProps = async ({ apolloClient, locale, query }) => {
  const serviceId = String(query.slug)

  // FIXME: use apollo GQL api
  const redirect = Math.random() < 0.2
  return {
    regulation: redirect ? exampleRegulationRedirect : exampleRegulation,
    originalBody: redirect ? undefined : exampleRegulationOriginalBody,
    history: redirect ? [] : regulationHistory,
    texts: regulationPageTexts,
  }
}

export default withMainLayout(RegulationPage)
