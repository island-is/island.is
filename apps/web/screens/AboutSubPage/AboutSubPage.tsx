import React from 'react'
import { Screen } from '@island.is/web/types'
import { QueryGetAboutSubPageArgs } from '@island.is/api/schema'
import {
  GetAboutSubPageQuery,
  GetAboutPageNavigationQuery,
  QueryGetAboutPageArgs,
} from '@island.is/web/graphql/schema'
import { GET_ABOUT_SUB_PAGE_QUERY, GET_ABOUT_PAGE_NAVIGATION } from '../queries'
import {
  Breadcrumbs,
  Link,
  Stack,
  Text,
  GridRow,
  GridColumn,
  Box,
  Navigation,
} from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import { RichText } from '@island.is/web/components'
import { useRouter } from 'next/router'
import { CustomNextError } from '@island.is/web/units/errors'
import Head from 'next/head'
import { Background, Slice as SliceType } from '@island.is/island-ui/contentful'
import { SidebarLayout } from '../Layouts/SidebarLayout'

export interface AboutSubPageProps {
  page: GetAboutSubPageQuery['getAboutSubPage']
  parentPage: GetAboutPageNavigationQuery['getAboutPage']
}

export const AboutSubPage: Screen<AboutSubPageProps> = ({
  page,
  parentPage,
}) => {
  const { asPath } = useRouter()
  const parentLink = [
    {
      title: parentPage.pageHeader.navigationText,
      href: '/stafraent-island',
      active: false,
    },
  ]

  const items = parentPage.pageHeader.links.map(({ text, url }) => ({
    title: text,
    href: url,
    active: asPath === url,
  }))

  return (
    <>
      <Head>
        <title>{page.title}</title>
      </Head>
      <Box paddingTop={[4, 4, 8]} overflow="hidden">
        <SidebarLayout
          isSticky={false}
          sidebarContent={
            <Box
              position={'relative'}
              display={['none', 'none', 'block']}
              style={{ zIndex: 10 }}
            >
              <Navigation
                colorScheme="blue"
                baseId="desktopNav"
                isMenuDialog={false}
                activeItemTitle={page.title}
                items={parentLink.concat(items)}
                title={parentPage.title}
              />
            </Box>
          }
        >
          <GridRow>
            <GridColumn
              span={['9/9', '9/9', '7/8', '7/8', '7/9']}
              offset={['0', '0', '0', '0', '1/9']}
            >
              <Stack space={[3, 3, 2]}>
                <Breadcrumbs>
                  <Link href="/">Ísland.is</Link>
                  <Link href="/stafraent-island">{parentPage.title}</Link>
                </Breadcrumbs>
                <Box display={['block', 'block', 'none']}>
                  <Navigation
                    colorScheme="blue"
                    baseId={'mobileNav'}
                    isMenuDialog={true}
                    activeItemTitle={page.title}
                    items={parentLink.concat(items)}
                    title={parentPage.title}
                  />
                </Box>
                <Text variant="h1" as="h1">
                  {page.title}
                </Text>
                {Boolean(page.description) && (
                  <Text variant="intro">{page.description}</Text>
                )}
                {Boolean(page.subDescription) && (
                  <Text>{page.subDescription}</Text>
                )}
              </Stack>
            </GridColumn>
          </GridRow>
          <Box paddingTop={5}>
            <Background
              background="dotted"
              paddingTop={[4, 4, 6, 10]}
              paddingBottom={page.bottomSlices.length ? 20 : 10}
            >
              <RichText body={page.slices as SliceType[]} />
            </Background>
          </Box>
          <RichText body={page.bottomSlices as SliceType[]} />
        </SidebarLayout>
      </Box>
    </>
  )
}

AboutSubPage.getInitialProps = async ({ apolloClient, locale, asPath }) => {
  const [page, parentPage] = await Promise.all([
    apolloClient
      .query<GetAboutSubPageQuery, QueryGetAboutSubPageArgs>({
        query: GET_ABOUT_SUB_PAGE_QUERY,
        variables: {
          input: {
            url: asPath,
            lang: locale,
          },
        },
      })
      .then((r) => r.data.getAboutSubPage),
    apolloClient
      .query<GetAboutPageNavigationQuery, QueryGetAboutPageArgs>({
        query: GET_ABOUT_PAGE_NAVIGATION,
        variables: {
          input: {
            lang: locale,
          },
        },
      })
      .then((r) => r.data.getAboutPage),
  ])

  if (!page) {
    throw new CustomNextError(404, 'subpage not found')
  }

  return {
    page,
    parentPage,
  }
}

export default withMainLayout(AboutSubPage)
