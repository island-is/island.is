import * as s from './RegulationPage.treat'

import {
  exampleRegulation,
  exampleRegulationOriginalBody,
  regulationPageTexts,
  regulationHistory,
  Regulation,
  RegulationHistoryItem,
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
  GridColumn,
  GridContainer,
  GridRow,
  Navigation,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { dateFormat } from '@island.is/shared/constants'
import { prettyName, useRegulationLinkResolver } from './regulationUtils'
import htmldiff from 'htmldiff-js'
import cn from 'classnames'

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
  regulation: Regulation
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

  const regulationBody = useMemo(
    () =>
      originalBody && showDiff
        ? htmldiff
            .execute(originalBody, regulation.body)
            .replace(/<del [^>]+>\s+<\/del>/g, '')
            .replace(/<ins [^>]+>\s+<\/ins>/g, '')
        : regulation.body,
    [showDiff, originalBody, regulation.body],
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
              </GridColumn>

              <GridColumn
                span={['1/1', '1/1', '1/1', '3/12']}
                order={[1, 1, 0]}
              >
                <Stack space={2}>
                  <Navigation
                    baseId="???"
                    title={
                      n('historyTitle') + ' ' + prettyName(regulation.name)
                    }
                    items={history.map((item) => ({
                      title: prettyName(item.name) + ' ' + item.title,
                      href: linkToRegulation(item.name),
                    }))}
                  />
                  {/* <p>Other sidebar content</p> */}
                </Stack>{' '}
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
  return {
    regulation: exampleRegulation,
    originalBody: exampleRegulationOriginalBody,
    history: regulationHistory,
    texts: regulationPageTexts,
  }
}

export default withMainLayout(RegulationPage)
