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
import { SubpageLayout } from '@island.is/web/screens/Layouts/Layouts'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import {
  Text,
  Stack,
  Breadcrumbs,
  Box,
  Link,
  Button,
} from '@island.is/island-ui/core'
import { SubpageMainContent } from '@island.is/web/components'

import getConfig from 'next/config'
import { CustomNextError } from '@island.is/web/units/errors'
import {
  ContentLanguage,
  GetNamespaceQuery,
  QueryGetNamespaceArgs,
  GetSubpageHeaderQuery,
  QueryGetSubpageHeaderArgs,
} from '@island.is/web/graphql/schema'
import { Slice as SliceType } from '@island.is/island-ui/contentful'
import { GET_NAMESPACE_QUERY, GET_SUBPAGE_HEADER_QUERY } from '../queries'
import { useNamespace } from '@island.is/web/hooks'
import RichText from '@island.is/web/components/RichText/RichText'
import { useI18n } from '@island.is/web/i18n'

const { publicRuntimeConfig } = getConfig()

/* TEMPORARY LAYOUT CREATED TO SCAFFOLD API CATALOGUE INTO THE WEB */

interface ApiCatalogueProps {
  subpageHeader: GetSubpageHeaderQuery['getSubpageHeader']
}

const ApiCatalogue: Screen<ApiCatalogueProps> = ({ subpageHeader }) => {
  /* DISABLE FROM WEB WHILE WIP */
  const { disableApiCatalog: disablePage } = publicRuntimeConfig

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
  /* --- */
  const { activeLocale } = useI18n()

  const onLoadMore = () => {
    if (data?.getApiCatalogue.pageInfo?.nextCursor === null) {
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

  const filterCategories = [
    {
      id: 'pricing',
      label: fn('pricing'),
      selected: parameters.pricing,
      filters: [
        {
          value: PricingCategory.FREE,
          label: fn('pricingFree'),
        },
        {
          value: PricingCategory.PAID,
          label: fn('pricingPaid'),
        },
      ],
    },
    {
      id: 'data',
      label: fn('data'),
      selected: parameters.data,
      filters: [
        {
          value: DataCategory.FINANCIAL,
          label: fn('dataFinancial'),
        },
        {
          value: DataCategory.HEALTH,
          label: fn('dataHealth'),
        },
        {
          value: DataCategory.OFFICIAL,
          label: fn('dataOfficial'),
        },
        {
          value: DataCategory.OPEN,
          label: fn('dataOpen'),
        },
        {
          value: DataCategory.PERSONAL,
          label: fn('dataPersonal'),
        },
        {
          value: DataCategory.PUBLIC,
          label: fn('dataPublic'),
        },
      ],
    },
    {
      id: 'type',
      label: fn('type'),
      selected: parameters.type,
      filters: [
        {
          value: TypeCategory.REST,
          label: fn('typeRest'),
        },
        {
          value: TypeCategory.SOAP,
          label: fn('typeSoap'),
        },
      ],
    },
    {
      id: 'access',
      label: fn('access'),
      selected: parameters.access,
      filters: [
        {
          value: AccessCategory.APIGW,
          label: fn('accessApigw'),
        },
        {
          value: AccessCategory.XROAD,
          label: fn('accessXroad'),
        },
      ],
    },
  ]

  return (
    <SubpageLayout
      main={
        <SidebarLayout sidebarContent={<>Navigation goes here</>}>
          <SubpageMainContent
            main={
              <Box>
                <Box marginBottom={2}>
                  <Breadcrumbs>
                    <Link href="/">Ísland.is</Link>
                    <a href="/throun">Þróun</a>
                    <a href="/throun/vefthjonustur">Vefþjónustur</a>
                    <span>{subpageHeader.title}</span>
                  </Breadcrumbs>
                </Box>
                <Stack space={1}>
                  <Text variant="h1">{subpageHeader.title}</Text>
                  <Text variant="intro">{subpageHeader.summary}</Text>
                  <Stack space={2}>
                    {subpageHeader.body ? (
                      <RichText
                        body={subpageHeader.body as SliceType[]}
                        config={{ defaultPadding: [2, 2, 4] }}
                        locale={activeLocale}
                      />
                    ) : null}
                  </Stack>
                </Stack>
              </Box>
            }
            image={
              <Box
                width="full"
                height="full"
                display="flex"
                alignItems="center"
              >
                <img
                  src={subpageHeader.featuredImage.url}
                  alt={subpageHeader.featuredImage.title}
                  width={subpageHeader.featuredImage.width}
                  height={subpageHeader.featuredImage.height}
                />
              </Box>
            }
          />
        </SidebarLayout>
      }
    />
  )
}

ApiCatalogue.getInitialProps = async ({ apolloClient, locale, query }) => {
  const [
    {
      data: { getSubpageHeader: subpageHeader },
    },
    headerNamespace,
  ] = await Promise.all([
    apolloClient.query<GetSubpageHeaderQuery, QueryGetSubpageHeaderArgs>({
      query: GET_SUBPAGE_HEADER_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
          id: 'VefthjonusturHome',
        },
      },
    }),
  ])

  return {
    subpageHeader,
  }
}

export default withMainLayout(ApiCatalogue)
