import React from 'react'
import getConfig from 'next/config'

import { Screen } from '@island.is/web/types'

import { GetNamespaceQuery } from '@island.is/web/graphql/schema'
import {
  Query,
  QueryGetApiCatalogueArgs,
  QueryGetNamespaceArgs,
} from '@island.is/api/schema'

import { GET_NAMESPACE_QUERY, GET_CATALOGUE_QUERY } from '../queries'
import { useNamespace } from '../../hooks'

import { withMainLayout } from '@island.is/web/layouts/main'
import { ApolloError } from '@apollo/client'
import { SidebarLayout } from '../Layouts/SidebarLayout'

import {
  ServiceList,
  SubpageMainContent,
  SubpageDetailsContent,
  ServiceTagDisplayNames,
} from '../../components'

import { SubpageLayout } from '../Layouts/Layouts'
import { Box, Stack, Text, Button, Link } from '@island.is/island-ui/core'
import { CustomNextError } from '@island.is/web/units/errors'

const { publicRuntimeConfig } = getConfig()

/* TEMPORARY LAYOUT CREATED TO SCAFFOLD API CATALOGUE INTO THE WEB */

interface ApiCatalogueProps {
  title: string
  data: Query
  loading: boolean
  error: ApolloError
  staticContent: GetNamespaceQuery['getNamespace']
  filterContent: GetNamespaceQuery['getNamespace']
}

const LIMIT = 100

const ApiCatalogue: Screen<ApiCatalogueProps> = ({
  title,
  data,
  loading,
  error,
  staticContent,
  filterContent,
}) => {
  const { disableApiCatalog: disablePage } = publicRuntimeConfig

  if (disablePage === 'true') {
    throw new CustomNextError(404, 'Not found')
  }

  const n = useNamespace(staticContent)
  const fn = useNamespace(filterContent)

  const translateTags = (): ServiceTagDisplayNames => {
    const names: ServiceTagDisplayNames = {
      APIGW: fn('accessApigw'),
      XROAD: fn('accessXroad'),
      FINANCIAL: fn('dataFinancial'),
      HEALTH: fn('dataHealth'),
      OFFICIAL: fn('dataOfficial'),
      PERSONAL: fn('dataPersonal'),
      PUBLIC: fn('dataPublic'),
      FREE: fn('pricingFree'),
      PAID: fn('pricingPaid'),
      GRAPHQL: fn('typeGraphql'),
      REST: fn('typeRest'),
      SOAP: fn('typeSoap'),
      OPEN: 'OPEN', //tag not currently used
    }
    return names
  }

  return (
    <SubpageLayout
      main={
        <SidebarLayout
          sidebarContent={
            <></> // Navigation menu kemur hér
          }
        >
          <SubpageMainContent
            main={
              <Box marginBottom={[3, 3, 3, 12]} marginTop={1}>
                <Stack space={1}>
                  <Text variant="h1">{n('webServicesTitle')}</Text>
                  <Text variant="intro">{n('webServicesDescription')}</Text>
                </Stack>
                <Box marginTop={1}>
                  <Text variant="default">{n('designGuideDescription')}</Text>
                  <Link href="https://docs.devland.is/handbook/technical-overview/api-design-guide">
                    <Button
                      colorScheme="default"
                      icon="arrowForward"
                      iconType="filled"
                      onBlur={function noRefCheck() {}}
                      onClick={function noRefCheck() {}}
                      onFocus={function noRefCheck() {}}
                      preTextIconType="filled"
                      size="default"
                      type="button"
                      variant="text"
                    >
                      {n('designGuideButtonTitle')}
                    </Button>
                  </Link>
                </Box>
              </Box>
            }
            image={<img src="/frame.png" alt="Viskuausan" />}
          />
        </SidebarLayout>
      }
      details={
        <SubpageDetailsContent
          header={
            <Text variant="h4" color="blue600">
              {n('title')}
            </Text>
          }
          content={
            <SidebarLayout
              sidebarContent={
                <></> // Hér kemur filterinn
              }
            >
              <ServiceList
                services={data?.getApiCatalogue.services}
                //loading={loading}
                moreToLoad={data?.getApiCatalogue?.pageInfo?.nextCursor != null}
                emptyListText={n('notFound')}
                errorMessage={
                  error
                    ? { heading: n('errorHeading'), text: n('errorText') }
                    : undefined
                }
                loadMoreButtonText={n('fmButton')}
                tagDisplayNames={translateTags()}
                // onLoadMoreClick={onLoadMore}
              />
            </SidebarLayout>
          }
        />
      }
    />
  )
}

ApiCatalogue.getInitialProps = async ({ apolloClient, locale, query }) => {
  const [staticContent, filterContent] = await Promise.all([
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'ApiCatalog',
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
  ])

  const { data, loading, error } = await apolloClient.query<
    Query,
    QueryGetApiCatalogueArgs
  >({
    query: GET_CATALOGUE_QUERY,
    variables: {
      input: {
        cursor: null,
        limit: LIMIT,
        query: '',
        pricing: [],
        data: [],
        type: [],
        access: [],
      },
    },
  })

  return {
    title: 'Vörulisti Vefþjónusta',
    data: data,
    loading,
    error,
    staticContent,
    filterContent,
  }
}

export default withMainLayout(ApiCatalogue)
