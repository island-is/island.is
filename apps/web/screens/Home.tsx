import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  ContentBlock,
  Box,
  Typography,
  Stack,
  Hidden,
  Columns,
  Column,
  Inline,
  Tag,
} from '@island.is/island-ui/core'
import { Categories, Card, SearchInput } from '../components'
import { withApollo } from '../graphql'
import { useI18n } from '../i18n'
import {
  Query,
  QueryGetNamespaceArgs,
  ContentLanguage,
  QueryCategoriesArgs,
} from '@island.is/api/schema'
import { GET_NAMESPACE_QUERY, GET_CATEGORIES_QUERY } from './queries'
import { Screen } from '../types'
import { useNamespace } from '../hooks'

interface HomeProps {
  categories: Query['categories']
  namespace: Query['getNamespace']
}

const Home: Screen<HomeProps> = ({ categories, namespace }) => {
  const Router = useRouter()
  const { activeLocale } = useI18n()
  const n = useNamespace(namespace)

  // TODO: Create a central link resolver to handle these urls
  const prefix = activeLocale === 'en' ? `/en` : ``
  const articlePath = activeLocale === 'en' ? 'article' : 'grein'
  const categoryPath = activeLocale === 'en' ? 'category' : 'flokkur'
  const searchPath = activeLocale === 'en' ? 'search' : 'leit'

  const cards = categories.map(({ title, slug, description }) => ({
    title,
    description,
    href: `${prefix}/${categoryPath}/[slug]`,
    as: `${prefix}/${categoryPath}/${slug}`,
  }))

  const onSubmit = (inputValue, selectedOption) => {
    if (selectedOption) {
      return Router.push(
        `${prefix}/${articlePath}/[slug]`,
        `${prefix}/${articlePath}/${selectedOption.value}`,
      )
    }

    return Router.push({
      pathname: `${prefix}/${searchPath}`,
      query: { q: inputValue },
    })
  }

  return (
    <>
      <ContentBlock>
        <Box
          position="relative"
          display="flex"
          flexDirection="column"
          width="full"
        >
          <DottedBackground />
          <Box position="relative">
            <Box
              paddingX={[3, 3, 6, 20]}
              paddingY={[3, 3, 6, 10]}
              display="flex"
              justifyContent="center"
            >
              <Box
                textAlign={['center', 'center', 'left']}
                width="full"
                paddingRight={[0, 0, 12]}
              >
                <Stack space={3}>
                  <Typography variant="eyebrow" as="h2" color="red400">
                    {n('heroPreTitle')}
                  </Typography>
                  <Typography variant="h1" as="h1">
                    {n('heroTitle')}
                  </Typography>
                  <Typography variant="p" as="p">
                    {n('heroSubTitle')}
                  </Typography>
                </Stack>
              </Box>
              <Hidden below="md">
                <Box>
                  <Svg />
                </Box>
              </Hidden>
            </Box>
            <Box padding={[1, 1, 6]}>
              <Box
                padding={[2, 2, 2, 10]}
                display="inlineBlock"
                background="white"
                boxShadow="subtle"
                width="full"
              >
                <Columns
                  space={[4, 4, 4, 12]}
                  collapseBelow="lg"
                  alignY="center"
                >
                  <Column>
                    <Box display="inlineFlex" alignItems="center" width="full">
                      <SearchInput
                        activeLocale={activeLocale}
                        onSubmit={onSubmit}
                      />
                    </Box>
                  </Column>
                  <Column>
                    <Inline space={1}>
                      {n('featuredArticles', []).map(({title, url}, index) => {
                        // TODO: Find a permanent solution to handle this url, currently only supports article urls
                        return (
                          <Link key={index} href={`${prefix}/${articlePath}/[slug]`} as={url}>
                            <a>
                              <Tag>{title}</Tag>
                            </a>
                          </Link>
                        )
                      })}
                    </Inline>
                  </Column>
                </Columns>
              </Box>
            </Box>
          </Box>
        </Box>
      </ContentBlock>
      <Box background="purple100">
        <ContentBlock width="large">
          <Categories label={n('articlesTitle')} seeMoreText={n('seeMore')}>
            {cards.map((card, index) => {
              return <Card key={index} {...card} tags={false} />
            })}
          </Categories>
        </ContentBlock>
      </Box>
    </>
  )
}

Home.getInitialProps = async ({ apolloClient, locale }) => {
  const [
    {
      data: { categories },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<Query, QueryCategoriesArgs>({
      query: GET_CATEGORIES_QUERY,
      variables: {
        input: {
          language: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query, QueryGetNamespaceArgs>({
      query: GET_NAMESPACE_QUERY,
      variables: {
        input: {
          namespace: 'Homepage',
          lang: locale,
        },
      },
    }).then((variables) => {
      // map data here to reduce data processing in component
      const namespaceObject = JSON.parse(variables.data.getNamespace.fields)
      // featuredArticles is a csv in contentful seperated by : where the first value is the title and the second is the url
      return {...namespaceObject.fields, featuredArticles: namespaceObject.fields['featuredArticles'].map((featuredArticle) => {
        const [title = '', url = ''] = featuredArticle.split(':');
        return {title, url};
      })}
    }),
  ])

  return {
    categories,
    namespace,
  }
}

export default withApollo(Home)

const DottedBackground = () => (
  <Box position="absolute" top={0} bottom={0} left={0} right={0} padding={3}>
    <Box background="dotted" height="full" width="full"></Box>
  </Box>
)

const Svg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="260"
      height="204"
      fill="none"
      viewBox="0 0 260 204"
    >
      <path
        fill="url(#paint0_linear)"
        fillRule="evenodd"
        d="M36.895 12.357C33.639 12.357 31 9.636 31 6.279S33.64.2 36.895.2c3.256 0 5.895 2.721 5.895 6.078s-2.64 6.078-5.895 6.078zm186 0c3.256 0 5.895-2.721 5.895-6.078S226.151.2 222.895.2 217 2.922 217 6.28s2.639 6.078 5.895 6.078zM135.79 38.24c0 3.357-2.639 6.078-5.895 6.078S124 41.597 124 38.24s2.639-6.078 5.895-6.078 5.895 2.721 5.895 6.078zm0 31.961c0 3.357-2.639 6.078-5.895 6.078S124 73.558 124 70.2c0-3.356 2.639-6.078 5.895-6.078s5.895 2.722 5.895 6.078zm-5.895 38.039c3.256 0 5.895-2.721 5.895-6.078 0-3.356-2.639-6.078-5.895-6.078S124 98.806 124 102.163c0 3.357 2.639 6.078 5.895 6.078zm5.895 25.883c0 3.357-2.639 6.078-5.895 6.078S124 137.48 124 134.123c0-3.356 2.639-6.077 5.895-6.077s5.895 2.721 5.895 6.077zm62-127.844c0 3.357-2.639 6.078-5.895 6.078S186 9.636 186 6.279 188.639.2 191.895.2s5.895 2.721 5.895 6.078zm25.105 38.039c3.256 0 5.895-2.721 5.895-6.078s-2.639-6.078-5.895-6.078S217 34.883 217 38.24s2.639 6.078 5.895 6.078zm36.895-6.078c0 3.357-2.639 6.078-5.895 6.078S248 41.597 248 38.24s2.639-6.078 5.895-6.078 5.895 2.721 5.895 6.078zm-67.895 6.078c3.256 0 5.895-2.721 5.895-6.078s-2.639-6.078-5.895-6.078S186 34.883 186 38.24s2.639 6.078 5.895 6.078zM166.79 38.24c0 3.357-2.639 6.078-5.895 6.078S155 41.597 155 38.24s2.639-6.078 5.895-6.078 5.895 2.721 5.895 6.078zm56.105 38.039c3.256 0 5.895-2.721 5.895-6.078 0-3.356-2.639-6.078-5.895-6.078S217 66.845 217 70.201c0 3.357 2.639 6.078 5.895 6.078zM259.79 70.2c0 3.357-2.639 6.078-5.895 6.078S248 73.558 248 70.2c0-3.356 2.639-6.078 5.895-6.078s5.895 2.722 5.895 6.078zm-67.895 6.078c3.256 0 5.895-2.721 5.895-6.078 0-3.356-2.639-6.078-5.895-6.078S186 66.845 186 70.201c0 3.357 2.639 6.078 5.895 6.078zM166.79 70.2c0 3.357-2.639 6.078-5.895 6.078S155 73.558 155 70.2c0-3.356 2.639-6.078 5.895-6.078s5.895 2.722 5.895 6.078zm56.105 38.039c3.256 0 5.895-2.721 5.895-6.078 0-3.356-2.639-6.078-5.895-6.078S217 98.806 217 102.163c0 3.357 2.639 6.078 5.895 6.078zm36.895-6.078c0 3.357-2.639 6.078-5.895 6.078S248 105.519 248 102.162c0-3.356 2.639-6.078 5.895-6.078s5.895 2.722 5.895 6.078zm-67.895 6.078c3.256 0 5.895-2.721 5.895-6.078 0-3.356-2.639-6.078-5.895-6.078S186 98.806 186 102.163c0 3.357 2.639 6.078 5.895 6.078zm-25.105-6.078c0 3.357-2.639 6.078-5.895 6.078S155 105.519 155 102.162c0-3.356 2.639-6.078 5.895-6.078s5.895 2.722 5.895 6.078zm56.105 38.039c3.256 0 5.895-2.721 5.895-6.078 0-3.356-2.639-6.077-5.895-6.077S217 130.767 217 134.123c0 3.357 2.639 6.078 5.895 6.078zm-25.105-6.078c0 3.357-2.639 6.078-5.895 6.078S186 137.48 186 134.123c0-3.356 2.639-6.077 5.895-6.077s5.895 2.721 5.895 6.077zm-36.895 6.078c3.256 0 5.895-2.721 5.895-6.078 0-3.356-2.639-6.077-5.895-6.077S155 130.767 155 134.123c0 3.357 2.639 6.078 5.895 6.078zm36.895 24.853c0 3.356-2.639 6.077-5.895 6.077S186 168.41 186 165.054c0-3.357 2.639-6.078 5.895-6.078s5.895 2.721 5.895 6.078zm-31 0c0 3.356-2.639 6.077-5.895 6.077S155 168.41 155 165.054c0-3.357 2.639-6.078 5.895-6.078s5.895 2.721 5.895 6.078zM62 6.279c0 3.357 2.64 6.078 5.895 6.078 3.256 0 5.895-2.721 5.895-6.078S71.15.2 67.895.2C64.639.201 62 2.922 62 6.28zM36.895 44.318c-3.256 0-5.895-2.721-5.895-6.078s2.64-6.078 5.895-6.078c3.256 0 5.895 2.721 5.895 6.078s-2.64 6.078-5.895 6.078zM0 38.24c0 3.357 2.64 6.078 5.895 6.078 3.256 0 5.895-2.721 5.895-6.078s-2.64-6.078-5.895-6.078C2.639 32.162 0 34.883 0 38.24zm67.895 6.078c-3.256 0-5.895-2.721-5.895-6.078s2.64-6.078 5.895-6.078c3.256 0 5.895 2.721 5.895 6.078s-2.64 6.078-5.895 6.078zM93 38.24c0 3.357 2.64 6.078 5.895 6.078 3.256 0 5.895-2.721 5.895-6.078s-2.639-6.078-5.895-6.078S93 34.883 93 38.24zM36.895 76.28C33.639 76.279 31 73.558 31 70.2c0-3.356 2.64-6.078 5.895-6.078 3.256 0 5.895 2.722 5.895 6.078 0 3.357-2.64 6.078-5.895 6.078zM0 70.2c0 3.357 2.64 6.078 5.895 6.078 3.256 0 5.895-2.721 5.895-6.078 0-3.356-2.64-6.078-5.895-6.078C2.639 64.123 0 66.845 0 70.201zm67.895 6.078C64.639 76.279 62 73.558 62 70.2c0-3.356 2.64-6.078 5.895-6.078 3.256 0 5.895 2.722 5.895 6.078 0 3.357-2.64 6.078-5.895 6.078zM93 70.2c0 3.357 2.64 6.078 5.895 6.078 3.256 0 5.895-2.721 5.895-6.078 0-3.356-2.639-6.078-5.895-6.078S93 66.845 93 70.201zM36.895 108.24c-3.256 0-5.895-2.721-5.895-6.078 0-3.356 2.64-6.078 5.895-6.078 3.256 0 5.895 2.722 5.895 6.078 0 3.357-2.64 6.078-5.895 6.078zM0 102.162c0 3.357 2.64 6.078 5.895 6.078 3.256 0 5.895-2.721 5.895-6.078 0-3.356-2.64-6.078-5.895-6.078-3.256 0-5.895 2.722-5.895 6.078zm67.895 6.078c-3.256 0-5.895-2.721-5.895-6.078 0-3.356 2.64-6.078 5.895-6.078 3.256 0 5.895 2.722 5.895 6.078 0 3.357-2.64 6.078-5.895 6.078zM93 102.162c0 3.357 2.64 6.078 5.895 6.078 3.256 0 5.895-2.721 5.895-6.078 0-3.356-2.639-6.078-5.895-6.078S93 98.806 93 102.163zm-56.105 38.039c-3.256 0-5.895-2.721-5.895-6.078 0-3.356 2.64-6.077 5.895-6.077 3.256 0 5.895 2.721 5.895 6.077 0 3.357-2.64 6.078-5.895 6.078zM62 134.123c0 3.357 2.64 6.078 5.895 6.078 3.256 0 5.895-2.721 5.895-6.078 0-3.356-2.64-6.077-5.895-6.077-3.256 0-5.895 2.721-5.895 6.077zm36.895 6.078c-3.256 0-5.895-2.721-5.895-6.078 0-3.356 2.64-6.077 5.895-6.077 3.256 0 5.895 2.721 5.895 6.077 0 3.357-2.639 6.078-5.895 6.078zM62 165.054c0 3.356 2.64 6.077 5.895 6.077 3.256 0 5.895-2.721 5.895-6.077 0-3.357-2.64-6.078-5.895-6.078-3.256 0-5.895 2.721-5.895 6.078zm31 0c0 3.356 2.64 6.077 5.895 6.077 3.256 0 5.895-2.721 5.895-6.077 0-3.357-2.639-6.078-5.895-6.078S93 161.697 93 165.054zm36.895 6.077c3.256 0 5.895-2.721 5.895-6.077 0-3.357-2.639-6.078-5.895-6.078S124 161.697 124 165.054c0 3.356 2.639 6.077 5.895 6.077zm5.895 25.884c0 3.356-2.639 6.077-5.895 6.077S124 200.371 124 197.015c0-3.357 2.639-6.078 5.895-6.078s5.895 2.721 5.895 6.078z"
        clipRule="evenodd"
      ></path>
      <defs>
        <linearGradient
          id="paint0_linear"
          x1="9.695"
          x2="193.224"
          y1="7.13"
          y2="241.357"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0161FD"></stop>
          <stop offset="0.25" stopColor="#3F46D2"></stop>
          <stop offset="0.51" stopColor="#812EA4"></stop>
          <stop offset="0.77" stopColor="#C21578"></stop>
          <stop offset="1" stopColor="#FD0050"></stop>
        </linearGradient>
      </defs>
    </svg>
  )
}
