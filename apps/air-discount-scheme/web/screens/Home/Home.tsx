import React from 'react'
import gql from 'graphql-tag'
import { Screen } from '../../types'
import { Layout } from '@island.is/air-discount-scheme-web/components/Layout'
import {
  Query,
  GenericPage,
  QueryGetGenericPageArgs,
} from '@island.is/api/schema'
import { Box, Breadcrumbs, Stack, Typography } from '@island.is/island-ui/core'
import Link from 'next/link'
import {
  Content,
  IntroText,
} from '@island.is/air-discount-scheme-web/components'
import { useI18n } from '@island.is/air-discount-scheme-web/i18n'

interface PropTypes {
  page?: GenericPage
}

const Home: Screen<PropTypes> = ({ page }) => {
  const { toRoute } = useI18n()

  return (
    <Layout
      left={
        <Box>
          <Box marginBottom={4}>
            <Breadcrumbs>
              <Link href={toRoute('home')}>
                <a>Ísland.is</a>
              </Link>
              <span>Loftbrú</span>
            </Breadcrumbs>
          </Box>
          <Box marginBottom={[3, 3, 3, 12]} marginTop={1}>
            <Stack space={3}>
              <Typography variant="h1" as="h1">
                {page.title}
              </Typography>
              <IntroText document={page.intro} />
              <Content
                document={page.mainContent}
                wrapper={(children) => <Stack space={3}>{children}</Stack>}
              />
            </Stack>
          </Box>
        </Box>
      }
      right={
        <Content
          document={page.sidebar}
          wrapper={(children) => <Stack space={3}>{children}</Stack>}
        />
      }
    />
  )
}

const GetGenericPageQuery = gql`
  query getGenericPage($input: GetGenericPageInput!) {
    getGenericPage(input: $input) {
      slug
      title
      intro
      mainContent
      sidebar
      misc
    }
  }
`

Home.getInitialProps = async ({ apolloClient, locale }) => {
  const {
    data: { getGenericPage: page },
  } = await apolloClient.query<Query, QueryGetGenericPageArgs>({
    query: GetGenericPageQuery,
    variables: {
      input: {
        lang: locale,
        slug: 'loftbru',
      },
    },
  })
  return {
    page,
  }
}

export default Home
