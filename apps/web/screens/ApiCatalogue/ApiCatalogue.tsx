import React from 'react'
import { Screen } from '@island.is/web/types'
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
import RichText from 'apps/web/components/RichText/RichText'
import { useI18n } from 'apps/web/i18n'


const { publicRuntimeConfig } = getConfig()

/* TEMPORARY LAYOUT CREATED TO SCAFFOLD API CATALOGUE INTO THE WEB */

interface ApiCatalogueProps {
  subpageHeader: GetSubpageHeaderQuery['getSubpageHeader']
  headerNamespace: GetNamespaceQuery['getNamespace']
}

const ApiCatalogue: Screen<ApiCatalogueProps> = ({
  subpageHeader,
  headerNamespace
}) => {
  /* DISABLE FROM WEB WHILE WIP */
  const { disableApiCatalog: disablePage } = publicRuntimeConfig

  if (disablePage === 'true') {
    throw new CustomNextError(404, 'Not found')
  }
  /* --- */
  const n = useNamespace(headerNamespace)

  const { activeLocale } = useI18n()

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
                    {subpageHeader.body ? 
                      <RichText 
                        body={subpageHeader.body as SliceType[]}
                        config={{defaultPadding: [2, 2, 4]}}
                        locale={activeLocale}
                      />
                      : null}
                    <Button icon="arrowForward" variant="text">
                      <Link href={n('handbookLink')}>
                        {n('dgButtonTitle')}
                      </Link>
                    </Button>
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
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            lang: locale as ContentLanguage,
            namespace: 'VefthjonusturHome',
          },
        },
      })
      .then((res) => JSON.parse(res.data.getNamespace.fields)),
  ])

  console.log(subpageHeader)

  return {
    subpageHeader,
    headerNamespace,
  }
}

export default withMainLayout(ApiCatalogue)
