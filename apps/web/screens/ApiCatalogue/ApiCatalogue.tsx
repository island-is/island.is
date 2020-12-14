import React, { useState } from 'react'
import getConfig from 'next/config'

import { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'

import { GetNamespaceQuery } from '@island.is/web/graphql/schema'
import {
  Query,
  QueryGetApiCatalogueArgs,
  QueryGetNamespaceArgs,
  GetApiCatalogueInput,
} from '@island.is/api/schema'

import {
  GET_NAMESPACE_QUERY,
  GET_CATALOGUE_QUERY,
} from '@island.is/web/screens/queries'
import { useNamespace } from '../../hooks'

import { withMainLayout } from '@island.is/web/layouts/main'
import { useQuery } from '@apollo/client'
import { SidebarLayout } from '../Layouts/SidebarLayout'

import {
  ServiceList,
  SubpageMainContent,
  SubpageDetailsContent,
} from '@island.is/web/components'

import { SubpageLayout } from '../Layouts/Layouts'
import {
  Box,
  Stack,
  Text,
  Button,
  Link,
  LoadingIcon,
  GridContainer,
} from '@island.is/island-ui/core'
const { publicRuntimeConfig } = getConfig()

/* TEMPORARY LAYOUT CREATED TO SCAFFOLD API CATALOGUE INTO THE WEB */

interface ApiCatalogueProps {
  mainContent: GetNamespaceQuery['getNamespace']
  staticContent: GetNamespaceQuery['getNamespace']
  filterContent: GetNamespaceQuery['getNamespace']
}

const LIMIT = 20

const ApiCatalogue: Screen<ApiCatalogueProps> = ({
  mainContent,
  staticContent,
  filterContent,
}) => {
  const { disableApiCatalog: disablePage } = publicRuntimeConfig

  if (disablePage === 'true') {
    throw new CustomNextError(404, 'Not found')
  }

  const sn = useNamespace(staticContent)

  const onLoadMore = () => {
    if (data?.getApiCatalogue.pageInfo?.nextCursor == null) {
      return
    }

    const { nextCursor } = data?.getApiCatalogue?.pageInfo
    const param = { ...parameters, cursor: nextCursor }
    fetchMore({
      variables: { input: param },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        fetchMoreResult.getApiCatalogue.services = [
          ...prevResult.getApiCatalogue.services,
          ...fetchMoreResult.getApiCatalogue.services,
        ]
        return fetchMoreResult
      },
    })
  }

  const [parameters, setParameters] = useState<GetApiCatalogueInput>({
    cursor: null,
    limit: LIMIT,
    query: '',
    pricing: [],
    data: [],
    type: [],
    access: [],
  })

  const { data, loading, error, fetchMore, refetch } = useQuery<
    Query,
    QueryGetApiCatalogueArgs
  >(GET_CATALOGUE_QUERY, {
    variables: {
      input: parameters,
    },
  })

  return (
    <SubpageLayout
      main={
        <SidebarLayout sidebarContent={<div>Navigation menu here</div>}>
          <SubpageMainContent main={<div>Main content here</div>} />
        </SidebarLayout>
      }
      details={
        <SubpageDetailsContent
          header={
            <Text variant="h4" color="blue600">
              {sn('title')}
            </Text>
          }
          content={
            <SidebarLayout sidebarContent={<>List filter here</>}>
              {(error || data?.getApiCatalogue?.services.length < 1) && (
                <GridContainer>
                  {error ? (
                    <Text>{sn('errorHeading')}</Text>
                  ) : loading ? (
                    <LoadingIcon animate color="blue400" size={32} />
                  ) : (
                    <Text>{sn('notFound')}</Text>
                  )}
                </GridContainer>
              )}
              {data?.getApiCatalogue?.services.length > 0 && (
                <GridContainer>
                  <ServiceList
                    services={data?.getApiCatalogue?.services}
                    tagDisplayNames={filterContent}
                  />
                  {data?.getApiCatalogue?.pageInfo?.nextCursor != null && (
                    <Box display="flex" justifyContent="center">
                      <Button
                        colorScheme="default"
                        iconType="filled"
                        onClick={() => onLoadMore()}
                        size="default"
                        type="button"
                        variant="ghost"
                      >
                        {!loading ? (
                          sn('fmButton')
                        ) : (
                          <LoadingIcon animate color="blue400" size={16} />
                        )}
                      </Button>
                    </Box>
                  )}
                </GridContainer>
              )}
            </SidebarLayout>
          }
        />
      }
    />
  )
}

ApiCatalogue.getInitialProps = async ({ apolloClient, locale, query }) => {
  console.log(locale)
  const [mainContent, staticContent, filterContent] = await Promise.all([
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'VefthjonusturHome',
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

  return {
    mainContent,
    staticContent,
    filterContent,
  }
}

export default withMainLayout(ApiCatalogue)
