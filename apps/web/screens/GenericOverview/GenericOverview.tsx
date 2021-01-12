import React from 'react'
import { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import {
  Breadcrumbs,
  Stack,
  Text,
  Box,
  Navigation,
  GridColumn,
  GridRow,
  Button,
} from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import { SidebarLayout } from '../Layouts/SidebarLayout'
import { Document } from '@contentful/rich-text-types'
import { GET_GENERIC_OVERVIEW_PAGE_QUERY } from '@island.is/web/screens/queries'
import {
  GetGenericOverviewPageQuery,
  QueryGetGenericOverviewPageArgs,
  IntroLinkImage,
} from '@island.is/web/graphql/schema'
import { LinkType, useLinkResolver } from '../../hooks/useLinkResolver'
import NextLink from 'next/link'
import { Image, renderHtml } from '@island.is/island-ui/contentful'

interface GenericOverviewProps {
  genericOverviewPage: GetGenericOverviewPageQuery['getGenericOverviewPage']
}

export const GenericOverview: Screen<GenericOverviewProps> = ({
  genericOverviewPage: { title, intro, navigation, overviewLinks },
}) => {
  const { linkResolver } = useLinkResolver()

  console.log(overviewLinks)
  const introLink = (leftImage: boolean, introLink: IntroLinkImage) => {
    const url =
      introLink.link.type === 'linkUrl'
        ? { href: introLink.link.slug }
        : {
            href: linkResolver(introLink.link.type as LinkType).href,
            as: linkResolver(introLink.link.type as LinkType).as,
          }
    return (
      <GridRow direction={leftImage ? 'row' : 'rowReverse'}>
        <GridColumn span={['8/8', '3/8', '4/8', '3/8']}>
          <Box width="full" position="relative">
            <Image
              url={introLink.image.url + '?w=774&fm=webp&q=80'}
              thumbnail={introLink.image.url + '?w=50&fm=webp&q=80'}
              {...introLink.image}
            />
          </Box>
        </GridColumn>
        <GridColumn span={['8/8', '5/8', '4/8', '5/8']}>
          <Box
            display="flex"
            flexDirection="column"
            flexGrow={1}
            height="full"
            justifyContent={'center'}
            paddingLeft={leftImage ? 6 : 0}
          >
            <Box>
              <Text variant="h2" marginBottom={2}>
                {introLink.title}
              </Text>
              {Boolean(introLink.intro) && (
                <Box marginBottom={4} style={{fontSize: '16px'}}>
                  {renderHtml(introLink.intro.document as Document)}
                </Box>
              )}
              <NextLink href={url.href} as={url.as}>
                <Button
                  icon="arrowForward"
                  iconType="filled"
                  type="button"
                  variant="text"
                >
                  {introLink.linkTitle}
                </Button>
              </NextLink>
            </Box>
          </Box>
        </GridColumn>
      </GridRow>
    )
  }
  return (
    <SidebarLayout
      fullWidthContent={true}
      sidebarContent={
        <Navigation
          baseId="desktopNav"
          items={[
            ...navigation.menuLinks.map((item) => ({
              title: item.title,
              typename: item.link.type,
              slug: [item.link.slug],
            })),
          ]}
          title={navigation.title}
          renderLink={(link, { typename, slug }) => {
            return typename === 'linkUrl' ? (
              <a href={slug[0]}>{link}</a>
            ) : (
              <NextLink {...linkResolver(typename as LinkType)} passHref>
                {link}
              </NextLink>
            )
          }}
        />
      }
    >
      <GridRow>
        <GridColumn
          offset={[null, null, null, null, '1/9']}
          span={['12/12', '12/12', '12/12', '12/12', '7/9']}
        >
          <Stack space={2}>
            <Breadcrumbs
              items={[
                {
                  title: 'Ísland.is',
                  href: '/',
                },
                {
                  title: navigation.title,
                },
              ]}
            />
            <Box display={['block', 'block', 'none']}>
              <Navigation
                baseId={'mobileNav'}
                isMenuDialog
                activeItemTitle={navigation.title}
                title={navigation.title}
                items={[
                  ...navigation.menuLinks.map((item) => ({
                    title: item.title,
                    typename: item.link.type,
                    slug: [],
                  })),
                ]}
                renderLink={(link, { typename, slug }) => {
                  return typename === 'linkUrl' ? (
                    <a href={slug[0]}>{link}</a>
                  ) : (
                    <NextLink {...linkResolver(typename as LinkType)} passHref>
                      {link}
                    </NextLink>
                  )
                }}
              />
            </Box>

            <Text variant="h1" as="h1">
              {title}
            </Text>

            {Boolean(intro) && (
              <Box marginBottom={10}>
                {renderHtml(intro.document as Document)}
              </Box>
            )}
          </Stack>
          <Stack space={6}>
            {overviewLinks.map((link, index) => {
              return introLink(index % 2 === 1, link as IntroLinkImage)
            })}
          </Stack>
        </GridColumn>
      </GridRow>
    </SidebarLayout>
  )
}

GenericOverview.getInitialProps = async ({ apolloClient, locale }) => {
  const [
    {
      data: { getGenericOverviewPage: genericOverviewPage },
    },
  ] = await Promise.all([
    apolloClient.query<
      GetGenericOverviewPageQuery,
      QueryGetGenericOverviewPageArgs
    >({
      query: GET_GENERIC_OVERVIEW_PAGE_QUERY,
      fetchPolicy: 'no-cache',
      variables: {
        input: { lang: locale, pageIdentifier: 'throun' },
      },
    }),
  ])

  if (!genericOverviewPage) {
    throw new CustomNextError(404, 'Page not found')
  }

  return { genericOverviewPage }
}

export default withMainLayout(GenericOverview)
