import React, { useState } from 'react'
import { Screen } from '@island.is/web/types'
import { withMainLayout } from '@island.is/web/layouts/main'
import { SubpageLayout } from '@island.is/web/screens/Layouts/Layouts'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { 
  Text, 
  Navigation, 
  TableOfContents, 
  Stack,
  Breadcrumbs,
  Box, 
  Link } from '@island.is/island-ui/core'
import { SubpageMainContent, SubpageDetailsContent } from '@island.is/web/components'

import getConfig from 'next/config'
import { CustomNextError } from '@island.is/web/units/errors'
import { 
  ContentLanguage,
  GetNamespaceQuery, 
  QueryGetNamespaceArgs } from '@island.is/web/graphql/schema'
import { GET_NAMESPACE_QUERY } from '../queries'
import { useNamespace } from '@island.is/web/hooks'


const { publicRuntimeConfig } = getConfig()

/* TEMPORARY LAYOUT CREATED TO SCAFFOLD API CATALOGUE INTO THE WEB */

interface ApiCatalogueProps {
  staticContent: GetNamespaceQuery['getNamespace']
  filterContent: GetNamespaceQuery['getNamespace']
  navContent: GetNamespaceQuery['getNamespace']
}

const ApiCatalogue: Screen<ApiCatalogueProps> = ({ staticContent, filterContent, navContent }) => {
  /* DISABLE FROM WEB WHILE WIP */
  const { disableApiCatalog: disablePage } = publicRuntimeConfig

  if (disablePage === 'true') {
    throw new CustomNextError(404, 'Not found')
  }
  /* --- */
  const n = useNamespace(staticContent)
  const fn = useNamespace(filterContent)
  const navn = useNamespace(navContent)

  return (
    <SubpageLayout
      main={
        <SidebarLayout
          sidebarContent={
            <Navigation
              activeItemTitle="Vefþjónustur"
              colorScheme="blue"
              items={[
                {
                  active: true,
                  href: navn('servicesLink'),
                  title: navn('servicesTitle'),
                  items: [
                    {
                      active: true,
                      href: navn('catalogueLink'),
                      title: navn('catalogueTitle')
                    }
                  ]
                }
              ]}
              title={navn('title')}
              titleLink={navn('titleLink')}
              isMenuDialog={false}
              baseId="x"
            />
          }
        >
          <SubpageMainContent 
            main={
              <Box>
                <Box marginBottom={2}>
                  <Breadcrumbs>
                    <Link href="/">
                      Ísland.is
                    </Link>
                    <a href="/throun">Þróun</a>
                    <a href="/throun/vefthjonustur">Vefþjónustur</a>
                    <span>{n('title')}</span>
                  </Breadcrumbs>
                </Box>
                <Stack space={1}>
                  <Text variant='h1'>{n('title')}</Text>
                  <Text variant='intro'>{n('intro')}</Text>
                </Stack>
              </Box>
            }
            image={
              <Box background='blueberry100' width='full' height='full'>
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
    staticContent,
    filterContent,
    navContent
  ] = await Promise.all([
    apolloClient.query<GetNamespaceQuery, QueryGetNamespaceArgs>({
      query: GET_NAMESPACE_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
          namespace: 'ApiCatalog',
        },
      },
    })
    .then((res) => JSON.parse(res.data.getNamespace.fields)),
    apolloClient.query<GetNamespaceQuery, QueryGetNamespaceArgs>({
      query: GET_NAMESPACE_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
          namespace: 'ApiCatalogFilter',
        },
      },
    })
    .then((res) => JSON.parse(res.data.getNamespace.fields)),
    apolloClient.query<GetNamespaceQuery, QueryGetNamespaceArgs>({
      query: GET_NAMESPACE_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
          namespace: 'ThrounNavigation',
        },
      },
    })
    .then((res) => JSON.parse(res.data.getNamespace.fields)),
  ])
  
  return {
    staticContent,
    filterContent,
    navContent,
  }
}

export default withMainLayout(ApiCatalogue)
