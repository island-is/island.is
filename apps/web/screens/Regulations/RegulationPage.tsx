import * as styles from './RegulationPage.treat'

import React from 'react'
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
  Text,
} from '@island.is/island-ui/core'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import {
  exampleRegulation,
  regulationPageTexts,
  regulationHistory,
  Regulation,
  RegulationHistoryItem,
} from './mockData'
import { ParsedUrlQuery } from 'querystring'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { dateFormat, defaultLanguage } from '@island.is/shared/constants'
import { useRegulationLinkResolver } from './regulationUtils'

// const { publicRuntimeConfig } = getConfig()

// ---------------------------------------------------------------------------

/** Returns the first query parameter value as string, falling back to '' */
const getParamStr = (query: ParsedUrlQuery, key: string): string => {
  const val = query[key]
  return val == null ? '' : typeof val === 'string' ? val : val[0]
}

/** Picks named keys from the query object and defaults them to '' */
const getParams = <K extends string>(
  query: ParsedUrlQuery,
  keys: Array<K>,
): Record<K, string> =>
  keys.reduce((obj, key) => {
    obj[key] = getParamStr(query, key)
    return obj
  }, {} as Record<K, string>)

// ---------------------------------------------------------------------------

type RegulationPageProps = {
  regulation: Regulation
  history: Array<RegulationHistoryItem>
  texts: typeof regulationPageTexts
}

const RegulationPage: Screen<RegulationPageProps> = (props) => {
  const { regulation, history } = props
  const router = useRouter()
  const dateUtl = useDateUtils()
  const formatDate = (isoDate: string) => {
    // Eff this! 👇
    // return dateUtl.format(new Date(isoDate), dateFormat[dateUtl.locale.code || defaultLanguage])
    return dateUtl.format(new Date(isoDate), dateFormat.is)
  }
  const n = useNamespace(props.texts)
  const { linkResolver, linkToRegulation } = useRegulationLinkResolver()

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
            href: linkResolver('article').href,
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
                span={['1/1', '1/1', '9/12', '8/12']}
                offset={['0', '0', '0', '1/12']}
                order={1}
              >
                {breadCrumbs}

                {!regulation.repealedDate ? (
                  <Text>
                    Núgildandi reglugerð
                    {regulation.lastAmendDate ? (
                      <>
                        {' – '}
                        <span>
                          uppfærð {formatDate(regulation.lastAmendDate)}
                        </span>
                      </>
                    ) : (
                      ''
                    )}
                  </Text>
                ) : (
                  <Text>
                    Úrelt reglugerð{' – '}
                    <span>
                      felld úr gildi {formatDate(regulation.repealedDate)}
                    </span>
                  </Text>
                )}
                <Text as="h1" variant="h1" marginTop={2}>
                  {regulation.name} {regulation.title}
                </Text>
                <div dangerouslySetInnerHTML={{ __html: regulation.body }} />
              </GridColumn>

              <GridColumn span={['1/1', '1/1', '3/12']} order={[1, 1, 0]}>
                <Navigation
                  baseId="???"
                  title={n('historyTitle')}
                  items={history.map((item) => ({
                    title: item.name + ' ' + item.title,
                    href: linkToRegulation(item.name),
                  }))}
                />
                my sidebar content...
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

  /** /
  const [
    linkStrings,
    filterContent,
    openApiContent,
    { data },
  ] = await Promise.all([
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'ApiCatalogueLinks',
            lang: locale,
          },
        },
      })
      .then((res) => JSON.parse(res.data.getNamespace.fields)),
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'ApiCatalogFilter',
            lang: locale,
          },
        },
      })
      .then((res) => JSON.parse(res.data.getNamespace.fields)),
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'OpenApiView',
            lang: locale,
          },
        },
      })
      .then((res) => JSON.parse(res.data.getNamespace.fields)),
    apolloClient.query<Query, QueryGetApiServiceByIdArgs>({
      query: GET_API_SERVICE_QUERY,
      variables: {
        input: {
          id: serviceId,
        },
      },
    }),
  ] as const)
/**/

  // FIXME: use apollo GQL api
  return {
    regulation: exampleRegulation,
    history: regulationHistory,
    texts: regulationPageTexts,
  }
}

export default withMainLayout(RegulationPage)
