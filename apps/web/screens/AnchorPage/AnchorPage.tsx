import React, { useMemo } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import slugify from '@sindresorhus/slugify'

import { Slice as SliceType } from '@island.is/island-ui/contentful'
import {
  Box,
  BreadCrumbItem,
  Breadcrumbs,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import {
  AnchorNavigation,
  BackgroundImage,
  Form,
  HeadWithSocialSharing,
  Sticky,
  WatsonChatPanel,
} from '@island.is/web/components'
import { Webreader } from '@island.is/web/components'
import { DIGITAL_ICELAND_PLAUSIBLE_TRACKING_DOMAIN } from '@island.is/web/constants'
import {
  GetAnchorPageQuery,
  GetNamespaceQuery,
  QueryGetAnchorPageArgs,
  QueryGetNamespaceArgs,
} from '@island.is/web/graphql/schema'
import { useNamespace, usePlausiblePageview } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useLocalLinkTypeResolver } from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  GET_ANCHOR_PAGE_QUERY,
  GET_NAMESPACE_QUERY,
} from '@island.is/web/screens/queries'
import { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import { createNavigation } from '@island.is/web/utils/navigation'
import { webRichText } from '@island.is/web/utils/richText'

import { watsonConfig } from './config'

interface AnchorPageProps {
  anchorPage: GetAnchorPageQuery['getAnchorPage']
  namespace: GetNamespaceQuery['getNamespace']
  locale: Locale
}

export const AnchorPage: Screen<AnchorPageProps> = ({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  anchorPage: { id, image, title, intro, content, featuredImage },
  namespace,
  locale,
}) => {
  useContentfulId(id)
  useLocalLinkTypeResolver()

  usePlausiblePageview(DIGITAL_ICELAND_PLAUSIBLE_TRACKING_DOMAIN)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()
  const router = useRouter()
  const { activeLocale } = useI18n()

  const navigation = useMemo(() => {
    return createNavigation(content, { title })
  }, [content, title])

  const breadcrumbItems = useMemo(() => {
    const items: BreadCrumbItem[] = [
      {
        title: 'Ísland.is',
        href: '/',
        typename: 'homepage',
      },
    ]

    const overviewUrl = router.asPath.slice(0, router.asPath.lastIndexOf('/'))

    // If we're viewing the digital iceland services we need to change the breadcrumbs
    if (
      linkResolver('digitalicelandservices', [], locale).href === overviewUrl
    ) {
      items.push({
        title: n('digitalIceland', 'Stafrænt Ísland'),
        href: overviewUrl.slice(0, overviewUrl.lastIndexOf('/')),
      })
      items.push({
        title: n('digitalIcelandServices', 'Þjónusta'),
        href: overviewUrl,
      })
    } else if (
      linkResolver('digitalicelandcommunityoverview', [], locale).href ===
      overviewUrl
    ) {
      items.push({
        title: n('digitalIceland', 'Stafrænt Ísland'),
        href: overviewUrl.slice(0, overviewUrl.lastIndexOf('/')),
      })
      items.push({
        title: n('digitalIcelandCommunity', 'Ísland.is samfélagið'),
        href: overviewUrl,
      })
    } else {
      items.push({
        title: n('lifeEvents', 'Lífsviðburðir'),
        href: overviewUrl,
      })
    }

    return items
  }, [])

  const socialImage = featuredImage ?? image

  return (
    <Box paddingBottom={[2, 2, 10]}>
      <HeadWithSocialSharing
        title={`${title} | Ísland.is`}
        description={intro}
        imageUrl={socialImage?.url}
        imageContentType={socialImage?.contentType}
        imageWidth={socialImage?.width?.toString()}
        imageHeight={socialImage?.height?.toString()}
      />

      <GridContainer id="main-content">
        <GridRow>
          <Box
            marginBottom={[4, 4, 4, 8]}
            display="inlineBlock"
            width="full"
            printHidden
          >
            {image && (
              <BackgroundImage
                ratio="12:4"
                background="transparent"
                boxProps={{ background: 'white' }}
                image={image}
              />
            )}
          </Box>
        </GridRow>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '8/12', '9/12']}>
            <GridRow>
              <GridColumn
                offset={['0', '0', '0', '0', '1/9']}
                span={['9/9', '9/9', '9/9', '9/9', '7/9']}
              >
                <Box paddingBottom={[2, 2, 4]}>
                  <Breadcrumbs
                    items={breadcrumbItems}
                    renderLink={(link, { href }) => {
                      return (
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore make web strict
                        <NextLink href={href} passHref legacyBehavior>
                          {link}
                        </NextLink>
                      )
                    }}
                  />
                </Box>
                <Text variant="h1" as="h1">
                  <span className="rs_read" id={slugify(title)}>
                    {title}
                  </span>
                </Text>

                <Webreader
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore make web strict
                  readId={null}
                  readClass="rs_read"
                />

                {intro && (
                  <Text variant="intro" as="p" paddingTop={2}>
                    <span className="rs_read" id={slugify(intro)}>
                      {intro}
                    </span>
                  </Text>
                )}
                <Box
                  printHidden
                  display={['block', 'block', 'block', 'none']}
                  paddingTop={6}
                  paddingBottom={2}
                >
                  <AnchorNavigation
                    title={n('categoryOverview', 'Á þessari síðu')}
                    navigation={navigation}
                    position="right"
                  />
                </Box>
                <Box className="rs_read" paddingTop={[3, 3, 4]}>
                  {webRichText(content as SliceType[], undefined, activeLocale)}
                </Box>
              </GridColumn>
            </GridRow>
          </GridColumn>
          <GridColumn hiddenBelow="lg" span={['0', '0', '0', '4/12', '3/12']}>
            <Box printHidden height="full" marginTop={10} paddingLeft={4}>
              <Sticky>
                <AnchorNavigation
                  title={n('categoryOverview', 'Á þessari síðu')}
                  navigation={navigation}
                  position="right"
                />
              </Sticky>
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
      {watsonConfig[locale] && ( // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        <WatsonChatPanel {...watsonConfig[locale]} />
      )}
    </Box>
  )
}

AnchorPage.getProps = async ({ apolloClient, locale, query }) => {
  const [
    {
      data: { getAnchorPage: anchorPage },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<GetAnchorPageQuery, QueryGetAnchorPageArgs>({
      query: GET_ANCHOR_PAGE_QUERY,
      fetchPolicy: 'no-cache',
      variables: {
        input: { lang: locale, slug: String(query.slug) },
      },
    }),
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Articles',
            lang: locale,
          },
        },
      })
      // map data here to reduce data processing in component
      .then((content) =>
        content.data.getNamespace?.fields
          ? JSON.parse(content.data.getNamespace.fields)
          : {},
      ),
  ])

  if (!anchorPage) {
    throw new CustomNextError(404, 'Anchor Page not found')
  }

  return { anchorPage, namespace, locale: locale as Locale }
}

export default withMainLayout(AnchorPage)
