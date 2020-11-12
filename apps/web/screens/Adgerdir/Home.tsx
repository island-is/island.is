/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {
  Box,
  ContentBlock,
  Text,
  Stack,
  Breadcrumbs,
  Link,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import { useWindowSize, useIsomorphicLayoutEffect } from 'react-use'
import { Slice as SliceType } from '@island.is/island-ui/contentful'
import {
  AdgerdirArticles,
  GroupedPages,
  CardsSlider,
  FeaturedNews,
  FrontpageSvg,
  RichText,
  HeadWithSocialSharing,
} from '@island.is/web/components'
import { useI18n } from '@island.is/web/i18n'
import {
  Query,
  QueryGetNamespaceArgs,
  ContentLanguage,
  QueryGetAdgerdirPagesArgs,
  QueryGetAdgerdirTagsArgs,
} from '@island.is/api/schema'
import {
  GET_ADGERDIR_TAGS_QUERY,
  GET_NAMESPACE_QUERY,
  GET_ADGERDIR_PAGES_QUERY,
  GET_ADGERDIR_FRONTPAGE_QUERY,
} from '../queries'
import routeNames from '@island.is/web/i18n/routeNames'
import { Screen } from '../../types'
import { ArticleLayout } from '@island.is/web/screens/Layouts/Layouts'
import { ColorSchemeContext } from '@island.is/web/context'
import { useNamespace } from '@island.is/web/hooks'
import { theme } from '@island.is/island-ui/theme'

interface HomeProps {
  frontpage: Query['getAdgerdirFrontpage']
  pages: Query['getAdgerdirPages']
  tags: Query['getAdgerdirTags']
  namespace: Query['getNamespace']
}

const Home: Screen<HomeProps> = ({ frontpage, pages, tags, namespace }) => {
  const { activeLocale } = useI18n()
  const n = useNamespace(namespace)
  const { makePath } = routeNames(activeLocale)
  const { width } = useWindowSize()
  const [isDesktop, setIsMobile] = React.useState(false)

  useIsomorphicLayoutEffect(() => {
    if (width >= theme.breakpoints.lg) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  if (typeof document === 'object') {
    document.documentElement.lang = activeLocale
  }

  const { items: pagesItems } = pages
  const { items: tagsItems } = tags

  let groupSliceCount = 0

  return (
    <>
      <HeadWithSocialSharing title={`Viðspyrna fyrir Ísland`} />
      <ArticleLayout
        sidebar={
          isDesktop ? (
            <Box
              height="full"
              width="full"
              alignItems="center"
              justifyContent="center"
            >
              <FrontpageSvg />
            </Box>
          ) : null
        }
      >
        <GridRow>
          <GridColumn
            offset={['0', '0', '0', '1/8']}
            span={['0', '0', '8/8', '7/8']}
            paddingBottom={2}
          >
            <Breadcrumbs color="blue400">
              <Link href={makePath()} as={makePath()}>
                <a>Ísland.is</a>
              </Link>
              <Link href={makePath('adgerdir')} as={makePath('adgerdir')}>
                <a>{n('covidAdgerdir', 'Covid aðgerðir')}</a>
              </Link>
            </Breadcrumbs>
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn
            offset={['0', '0', '0', '1/8']}
            span={['8/8', '8/8', '8/8', '7/8']}
          >
            <Stack space={2}>
              <Text variant="h1" as="h1">
                {frontpage.title}
              </Text>
              <Text variant="intro" as="p">
                {frontpage.description}
              </Text>
              <RichText
                body={frontpage.content as SliceType[]}
                config={{ defaultPadding: [2, 2, 4], skipGrid: true }}
                locale={activeLocale}
              />
            </Stack>
          </GridColumn>
        </GridRow>
      </ArticleLayout>
      <ColorSchemeContext.Provider value={{ colorScheme: 'red' }}>
        <Box marginBottom={10}>
          <Box background="red100">
            <ContentBlock width="large">
              <AdgerdirArticles
                tags={tagsItems}
                items={pagesItems}
                namespace={namespace}
              />
            </ContentBlock>
          </Box>
        </Box>
      </ColorSchemeContext.Provider>
      <Box marginBottom={[6, 6, 15]}>
        <Stack space={[6, 6, 12]}>
          {frontpage.slices.map((slice, index) => {
            switch (slice.__typename) {
              case 'AdgerdirFeaturedNewsSlice':
                return <FeaturedNews key={index} items={slice.featured} />
              case 'AdgerdirGroupSlice':
                groupSliceCount++

                return (
                  <ColorSchemeContext.Provider
                    key={index}
                    value={{
                      colorScheme: groupSliceCount % 2 ? 'blue' : 'purple',
                    }}
                  >
                    <Box width="full" overflow="hidden">
                      <ContentBlock width="large">
                        <GroupedPages
                          topContent={
                            <Stack space={2}>
                              <Text
                                variant="eyebrow"
                                as="h2"
                                color="roseTinted400"
                              >
                                {slice.subtitle}
                              </Text>
                              <Text variant="h2" as="h3">
                                {slice.title}
                              </Text>
                              <Text as="p">{slice.description}</Text>
                            </Stack>
                          }
                          bottomContent={
                            <CardsSlider
                              items={slice.pages.filter(
                                (x) => x.title && x.slug,
                              )}
                            />
                          }
                        />
                      </ContentBlock>
                    </Box>
                  </ColorSchemeContext.Provider>
                )
            }

            return null
          })}
        </Stack>
      </Box>
    </>
  )
}

Home.getInitialProps = async ({ apolloClient, locale }) => {
  const [
    {
      data: { getAdgerdirFrontpage },
    },
    {
      data: { getAdgerdirTags },
    },
    {
      data: { getAdgerdirPages },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetAdgerdirPagesArgs>({
      query: GET_ADGERDIR_FRONTPAGE_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query, QueryGetAdgerdirTagsArgs>({
      query: GET_ADGERDIR_TAGS_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query, QueryGetAdgerdirPagesArgs>({
      query: GET_ADGERDIR_PAGES_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Vidspyrna',
            lang: locale,
          },
        },
      })
      .then((variables) => JSON.parse(variables.data.getNamespace.fields)),
  ])

  return {
    frontpage: getAdgerdirFrontpage,
    tags: getAdgerdirTags,
    pages: getAdgerdirPages,
    namespace,
    showSearchInHeader: false,
  }
}

export default withMainLayout(Home)
