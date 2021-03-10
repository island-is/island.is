import React from 'react'
import {
  ContentLanguage,
  GetNamespaceQuery,
  QueryGetNamespaceArgs,
  GetSubpageHeaderQuery,
  QueryGetSubpageHeaderArgs,
} from '@island.is/web/graphql/schema'
import { Screen } from '@island.is/web/types'
import { SubpageLayout } from '@island.is/web/screens/Layouts/Layouts'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { SubpageMainContent, RichText } from '@island.is/web/components'
import { useI18n } from '@island.is/web/i18n'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'

import {
  Text,
  Stack,
  Breadcrumbs,
  Box,
  Button,
  Navigation,
  Link,
} from '@island.is/island-ui/core'

import { useNamespace } from '@island.is/web/hooks'
import { Slice as SliceType } from '@island.is/island-ui/contentful'
import { GET_NAMESPACE_QUERY, GET_SUBPAGE_HEADER_QUERY } from '../queries'
import { withMainLayout } from '@island.is/web/layouts/main'

interface DeveloperHandbookProps {
  subpageHeader: GetSubpageHeaderQuery['getSubpageHeader']
  navigationLinks: GetNamespaceQuery['getNamespace']
}

const DeveloperHandbook: Screen<DeveloperHandbookProps> = ({
  subpageHeader,
  navigationLinks,
}) => {
  const { activeLocale } = useI18n()
  const n = useNamespace(navigationLinks)

  const { linkResolver } = useLinkResolver()

  const navigationItems = [
    {
      href: linkResolver('webservicespage').href,
      title: n('linkServicesText'),
    },
    {
      active: true,
      href: linkResolver('handbookpage').href,
      title: n('linkHandbookNavText'),
    },
    {
      href: n('linkIslandUI'),
      title: n('linkIslandUIText'),
    },
    {
      href: n('linkDesignSystem'),
      title: n('linkDesignSystemText'),
    },
  ]

  return (
    <SubpageLayout
      main={
        <SidebarLayout
          sidebarContent={
            <Navigation
              baseId="handbook-navigation"
              colorScheme="blue"
              items={navigationItems}
              title={n('linkThrounText')}
              titleLink={{
                href: linkResolver('developerspage').href,
              }}
            />
          }
        >
          <SubpageMainContent
            main={
              <Box>
                <Box display={['inline', 'inline', 'none']}>
                  {/* Show when a device */}
                  <Box paddingBottom="gutter">
                    <Button
                      colorScheme="default"
                      preTextIcon="arrowBack"
                      size="small"
                      variant="text"
                    >
                      <Link {...linkResolver('developerspage')}>
                        {n('linkThrounText')}
                      </Link>
                    </Button>
                  </Box>
                  <Box marginBottom="gutter">
                    <Navigation
                      baseId="handbook-navigation"
                      colorScheme="blue"
                      isMenuDialog
                      items={navigationItems}
                      title={n('linkThrounText')}
                      titleLink={{
                        href: linkResolver('developerspage').href,
                      }}
                    />
                  </Box>
                </Box>
                <Box marginBottom={2} display={['none', 'none', 'inline']}>
                  {/* Show when NOT a device */}
                  <Breadcrumbs
                    items={[
                      {
                        title: n('linkIslandIsText'),
                        href: linkResolver('homepage').href,
                      },
                      {
                        title: n('linkThrounText'),
                        href: linkResolver('developerspage').href,
                      },
                    ]}
                  />
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
                    <Button variant="text" icon="arrowForward">
                      <Link href={n('linkHandbook')}>
                        {n('linkHandbookText')}
                      </Link>
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            }
          />
        </SidebarLayout>
      }
    />
  )
}

DeveloperHandbook.getInitialProps = async ({ apolloClient, locale, query }) => {
  const [
    {
      data: { getSubpageHeader: subpageHeader },
    },
    navigationLinks,
  ] = await Promise.all([
    apolloClient.query<GetSubpageHeaderQuery, QueryGetSubpageHeaderArgs>({
      query: GET_SUBPAGE_HEADER_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
          id: 'HandbookLandingPage',
        },
      },
    }),
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
  ])

  return {
    subpageHeader,
    navigationLinks,
  }
}

export default withMainLayout(DeveloperHandbook)
