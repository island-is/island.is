import React from 'react'
import NextLink from 'next/link'
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
  Stack,
  Text,
  Box,
  Navigation,
  NavigationItem,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import { RichText } from '@island.is/web/components'
import { useRouter } from 'next/router'
import { CustomNextError } from '@island.is/web/units/errors'
import Head from 'next/head'
import {
  Background,
  richText,
  Slice as SliceType,
} from '@island.is/island-ui/contentful'
import { SidebarLayout } from '../Layouts/SidebarLayout'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'

export interface AboutSubPageProps {
  page: GetAboutSubPageQuery['getAboutSubPage']
  parentPage: GetAboutPageNavigationQuery['getAboutPage']
}

export const AboutSubPage: Screen<AboutSubPageProps> = ({
  page,
  parentPage,
}) => {
  const { asPath } = useRouter()
  const { linkResolver } = useLinkResolver()

  const parentPageLink: NavigationItem = {
    title: parentPage.pageHeader.navigationText,
    href: `/${parentPage.slug}`,
    active: false,
  }

  const items: NavigationItem[] = parentPage.pageHeader.links.map(
    ({ text, url }) => ({
      title: text,
      href: url,
      active: asPath === url,
    }),
  )

  const navList = [parentPageLink, ...items]

  return (
    <>
      <Head>
        <title>{page.title}</title>
      </Head>
      <Box paddingTop={[4, 4, 8]} overflow="hidden">
        <SidebarLayout
          isSticky={false}
          fullWidthContent={true}
          sidebarContent={
            <Box
              position={'relative'}
              display={['none', 'none', 'block']}
              style={{ zIndex: 10 }}
            >
              <Navigation
                baseId="desktopNav"
                items={navList}
                title={parentPage.title}
                titleLink={{ href: `/${parentPage.slug}`, active: false }}
              />
            </Box>
          }
        >
          <GridRow>
            <GridColumn
              offset={[null, null, null, '1/9']}
              span={['12/12', '12/12', '12/12', '8/9']}
            >
              <Stack space={2}>
                <Breadcrumbs
                  items={[
                    {
                      title: 'Ísland.is',
                      typename: 'homepage',
                      href: '/',
                    },

                    {
                      title: parentPage.title,
                      typename: 'page',
                      href: '/',
                    },
                  ]}
                  renderLink={(link, { typename }) => {
                    return (
                      <NextLink
                        {...linkResolver(typename as LinkType)}
                        passHref
                      >
                        {link}
                      </NextLink>
                    )
                  }}
                />
                <Box display={['block', 'block', 'none']}>
                  <Navigation
                    baseId={'mobileNav'}
                    isMenuDialog
                    activeItemTitle={page.title}
                    items={navList}
                    title={parentPage.title}
                    titleLink={{ href: `/${parentPage.slug}`, active: false }}
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
                {Boolean(page.intro) && (
                  <Box>{richText([page.intro] as SliceType[])}</Box>
                )}
              </Stack>
            </GridColumn>
          </GridRow>
          <Box paddingTop={5}>
            <Background
              backgroundPattern="dotted"
              paddingTop={[4, 4, 6, 10]}
              paddingBottom={page.bottomSlices.length ? 20 : 10}
            >
              <RichText body={page.slices as SliceType[]} />
            </Background>
          </Box>
        </SidebarLayout>
        <RichText body={page.bottomSlices as SliceType[]} />
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
            // TODO: Revisit when updating language switch
            url: asPath.split('?')[0], // split is so path ignores get query param
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
