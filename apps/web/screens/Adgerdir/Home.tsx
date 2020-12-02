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
  Hidden,
  GridRow,
  GridContainer,
  ColorSchemeContext,
  Main,
} from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Slice as SliceType } from '@island.is/island-ui/contentful'
import {
  AdgerdirArticles,
  GroupedPages,
  CardsSlider,
  FeaturedNews,
  FrontpageSvg,
  RichText,
  HeadWithSocialSharing,
  ChatPanel,
  Header,
  BackgroundImage,
} from '@island.is/web/components'
import { ColorSchemeContext as CovidColorSchemeContext } from '@island.is/web/components/Adgerdir/UI/ColorSchemeContext/ColorSchemeContext'
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
import { useNamespace } from '@island.is/web/hooks'

import * as covidStyles from '@island.is/web/components/Adgerdir/UI/styles/styles.treat'

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

  if (typeof document === 'object') {
    document.documentElement.lang = activeLocale
  }

  const { items: pagesItems } = pages
  const { items: tagsItems } = tags

  let groupSliceCount = 0

  return (
    <>
      <HeadWithSocialSharing
        title={frontpage.title}
        description={frontpage.description}
        imageUrl={frontpage.featuredImage?.url}
        imageWidth={frontpage.featuredImage?.width?.toString()}
        imageHeight={frontpage.featuredImage?.height?.toString()}
      />
      <Box className={covidStyles.frontpageBg}>
        <ColorSchemeContext.Provider value={{ colorScheme: 'white' }}>
          <Header buttonColorScheme="negative" />
        </ColorSchemeContext.Provider>
        <GridContainer>
          <Box paddingTop={[2, 2, 10]} paddingBottom={[4, 4, 4, 10]}>
            <GridRow>
              <GridColumn span={['12/12', '12/12', '12/12', '8/12']}>
                <GridRow>
                  <GridColumn
                    offset={['0', '0', '0', '1/8']}
                    span={['8/8', '8/8', '8/8', '7/8']}
                  >
                    <Stack space={2}>
                      <span className={covidStyles.white}>
                        <Breadcrumbs color="white">
                          <Link href={makePath()} as={makePath()}>
                            <a>Ísland.is</a>
                          </Link>
                          <Link
                            href={makePath('adgerdir')}
                            as={makePath('adgerdir')}
                          >
                            <a>{n('covidAdgerdir', 'Covid aðgerðir')}</a>
                          </Link>
                        </Breadcrumbs>
                      </span>
                      <Text variant="h1" as="h1" color="white">
                        {frontpage.title}
                      </Text>
                      <Text variant="intro" as="p" color="white">
                        {frontpage.description}
                      </Text>
                      <span className={covidStyles.white}>
                        <RichText
                          body={frontpage.content as SliceType[]}
                          config={{ defaultPadding: [2, 2, 4], skipGrid: true }}
                          locale={activeLocale}
                        />
                      </span>
                    </Stack>
                  </GridColumn>
                </GridRow>
              </GridColumn>
              <GridColumn hiddenBelow="md" span={['0', '0', '0', '4/12']}>
                <Hidden below="lg" print={true}>
                  <Box
                    height="full"
                    width="full"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <img src="/covid/birds.png" alt="Fuglar" />
                  </Box>
                </Hidden>
              </GridColumn>
            </GridRow>
          </Box>
        </GridContainer>
      </Box>

      <Main>
        <CovidColorSchemeContext.Provider value={{ colorScheme: 'green' }}>
          <Box marginBottom={10}>
            <Box className={covidStyles.bg}>
              <ContentBlock width="large">
                <AdgerdirArticles
                  tags={tagsItems}
                  items={pagesItems}
                  namespace={namespace}
                />
              </ContentBlock>
            </Box>
          </Box>
        </CovidColorSchemeContext.Provider>
        <Box marginBottom={[6, 6, 15]}>
          <Stack space={[6, 6, 12]}>
            {frontpage.slices.map((slice, index) => {
              const colorScheme = groupSliceCount % 2 ? 'blue' : 'green'

              switch (slice.__typename) {
                case 'AdgerdirFeaturedNewsSlice':
                  return <FeaturedNews key={index} items={slice.featured} />
                case 'AdgerdirGroupSlice':
                  groupSliceCount++

                  return (
                    <CovidColorSchemeContext.Provider
                      key={index}
                      value={{
                        colorScheme,
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
                                  <span
                                    className={
                                      covidStyles.textColor[colorScheme]
                                    }
                                  >
                                    {slice.subtitle}
                                  </span>
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
                    </CovidColorSchemeContext.Provider>
                  )
              }

              return null
            })}
          </Stack>
        </Box>
        <ChatPanel />
      </Main>
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

export default withMainLayout(Home, {
  showHeader: false,
  hasDrawerMenu: false,
})
