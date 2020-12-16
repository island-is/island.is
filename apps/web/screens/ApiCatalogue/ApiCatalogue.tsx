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
  Link,
  Button } from '@island.is/island-ui/core'
import { SubpageMainContent, SubpageDetailsContent } from '@island.is/web/components'

import getConfig from 'next/config'
import { CustomNextError } from '@island.is/web/units/errors'
import { 
  ContentLanguage,
  GetNamespaceQuery, 
  QueryGetNamespaceArgs,
  GetSubpageHeaderQuery, 
  QueryGetSubpageHeaderArgs, 
  SubpageHeader} from '@island.is/web/graphql/schema'
import { GET_NAMESPACE_QUERY, GET_SUBPAGE_HEADER_QUERY } from '../queries'
import { useNamespace } from '@island.is/web/hooks'


const { publicRuntimeConfig } = getConfig()

/* TEMPORARY LAYOUT CREATED TO SCAFFOLD API CATALOGUE INTO THE WEB */

interface ApiCatalogueProps {
  subpageHeader: GetSubpageHeaderQuery['getSubpageHeader']
  staticContent: GetNamespaceQuery['getNamespace']
  filterContent: GetNamespaceQuery['getNamespace']
  navContent: GetNamespaceQuery['getNamespace']
}

const ApiCatalogue: Screen<ApiCatalogueProps> = ({ subpageHeader, staticContent, filterContent, navContent }) => {
  /* DISABLE FROM WEB WHILE WIP */
  const { disableApiCatalog: disablePage } = publicRuntimeConfig

  if (disablePage === 'true') {
    throw new CustomNextError(404, 'Not found')
  }
  /* --- */
  const n = useNamespace(staticContent)
  const fn = useNamespace(filterContent)
  const navn = useNamespace(navContent)
  const content = JSON.parse(subpageHeader.content)

  return (
    <SubpageLayout
      main={
        <SidebarLayout
          sidebarContent={
            <>Navigation goes here</>
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
                    <span>{subpageHeader.title}</span>
                  </Breadcrumbs>
                </Box>
                <Stack space={1}>
                  <Text variant='h1'>{subpageHeader.title}</Text>
                  <Text variant='intro'>{subpageHeader.summary}</Text>
                  <Text>{content.text}</Text>
                  <Button
                    icon='arrowForward'
                    variant='text'

                  >
                    <Link href={content.handbookLink}>
                      {content.dgButtonTitle}
                    </Link>
                  </Button>
                </Stack>
              </Box>
            }
            image={
              <Box width='full' height='full' display='flex' alignItems='center'>
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
    staticContent,
    filterContent,
    navContent
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
    subpageHeader,
    staticContent,
    filterContent,
    navContent,
  }
}

export default withMainLayout(ApiCatalogue)
