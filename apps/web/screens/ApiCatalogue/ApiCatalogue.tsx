import React from 'react'
import { Screen } from '@island.is/web/types'

import { GetNamespaceQuery } from '@island.is/web/graphql/schema'
import {
  Query,
  QueryGetApiCatalogueArgs,
  QueryGetNamespaceArgs,
} from '@island.is/api/schema'

import { GET_NAMESPACE_QUERY } from '../queries'
import { GET_CATALOGUE_QUERY } from '../queries/ApiCatalogue'
import { useNamespace } from '../../hooks'

import { withMainLayout } from '@island.is/web/layouts/main'
import getConfig from 'next/config'
import {
  ServiceListContainer,
  TagDisplayNames,
} from 'apps/web/components/ServiceListContainer/ServiceListContainer'
import { ApolloError } from '@apollo/client'
import { SidebarLayout } from '../Layouts/SidebarLayout'

import { SubpageMainContent } from '../../components/SubpageMainContent'
import { SubpageDetailsContent } from '../../components/SubpageDetailsContent'

import { SubpageLayout } from '../Layouts/Layouts'
import {
  Box,
  Stack,
  Text,
  Button,
} from '@island.is/island-ui/core'

const { publicRuntimeConfig } = getConfig()

/* TEMPORARY LAYOUT CREATED TO SCAFFOLD API CATALOGUE INTO THE WEB */

interface ApiCatalogueProps {
  title: string
  data: Query
  loading: boolean
  error: ApolloError
  designGuideContent: GetNamespaceQuery['getNamespace']
  staticContent     : GetNamespaceQuery['getNamespace']
  filterContent     : GetNamespaceQuery['getNamespace']
}

const LIMIT = 100

const ApiCatalogue: Screen<ApiCatalogueProps> = ({
  title,
  data,
  loading,
  error,
  designGuideContent,
  staticContent,
  filterContent,
}) => {
  // const { disableApiCatalog: disablePage } = publicRuntimeConfig

  // if (disablePage === 'true') {
  //   throw new CustomNextError(404, 'Not found')
  // }

  const n = useNamespace(staticContent)
  const fn = useNamespace(filterContent)
  const dn = useNamespace(designGuideContent)
  const TEXT_NOT_FOUND = n('notFound')
  const HEADING_ERROR = n('errorHeading')
  const TEXT_ERROR = n('errorText')
  const TEXT_LOAD_MORE = n('fmButton')

  const translateTags = (): TagDisplayNames => {
    const names: TagDisplayNames = {
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
            <div>Navigation menu kemur hér</div>
          }
        >
          <SubpageMainContent 
            main={
              <Box marginBottom={[3, 3, 3, 12]} marginTop={1}>
              <Stack space={1}>
                <Text variant="h1">{dn('title')}</Text>
                <Text variant="intro">{dn('intro')}</Text>
              </Stack>
            <Stack space={1}>
            <Button
              colorScheme="default"
              icon="arrowForward"
              iconType="filled"
              onBlur={function noRefCheck(){}}
              onClick={function noRefCheck(){}}
              onFocus={function noRefCheck(){}}
              preTextIconType="filled"
              size="default"
              type="button"
              variant="text"
            >
              {dn('dgButtonTitle')}
            </Button>
            </Stack>
          </Box>
            }
            image={
              <img src="/frame.png" alt="Viskuausan" />
            } 
          />
        </SidebarLayout>
      }
      details={
        <SubpageDetailsContent 
          header={
            <></> // Titill fyrir details hér (API vörulisti)
          }
          content={
            <SidebarLayout
              sidebarContent={
                <></> // Hér kemur filterinn
              }
            >
              <ServiceListContainer
                services={data?.getApiCatalogue.services}
                span={['12/12', '12/12', '12/12', '6/12', '4/12']}
                loading={loading}
                moreToLoad={data?.getApiCatalogue?.pageInfo?.nextCursor != null}
                emptyListText={TEXT_NOT_FOUND}
                errorMessage={
                  error ? { heading: HEADING_ERROR, text: TEXT_ERROR } : undefined
                }
                loadMoreButtonText={TEXT_LOAD_MORE}
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
  console.log(locale)
  const [designGuideContent, staticContent, filterContent] = await Promise.all([
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'ViskuausanHome',
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
  console.log("filterContent-----------------------------------------------------------------")
  console.log(filterContent)
  console.log("------------------------------------------------------------------------------")
  return {
    title: 'Vörulisti Vefþjónusta',
    data: data,
    loading,
    error,
    designGuideContent,
    staticContent,
    filterContent,
  }
}

export default withMainLayout(ApiCatalogue)
