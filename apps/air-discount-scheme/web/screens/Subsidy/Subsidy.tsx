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

export interface SubsidyProps {
  page?: GenericPage
}

const Subsidy: Screen<SubsidyProps> = ({
  page: { title, intro, mainContent, sidebar, misc },
}) => {
  const {
    attention,
    codeDisclaimer,
    myRights,
    remaining,
    copyCode,
    codeDescription,
    kidsRights,
    currentUsage,
    path,
    user,
    date,
  } = JSON.parse(misc)
  return (
    <Layout
      left={
        <Box marginBottom={[3, 3, 3, 12]}>
          <Stack space={3}>
            <Typography variant="h1" as="h1">
              {title}
            </Typography>
            <IntroText document={intro} />
            <Content
              document={mainContent}
              wrapper={(children) => <Stack space={3}>{children}</Stack>}
            />
          </Stack>
        </Box>
      }
      right={
        <Content
          document={sidebar}
          wrapper={(children) => <Stack space={3}>{children}</Stack>}
        />
      }
    />
  )
}

export default Subsidy

const GET_GENERIC_PAGE_QUERY = gql`
  query($input: GetGenericPageInput!) {
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

Subsidy.getInitialProps = async ({ apolloClient, locale }) => {
  const {
    data: { getGenericPage: page },
  } = await apolloClient.query<Query, QueryGetGenericPageArgs>({
    query: GET_GENERIC_PAGE_QUERY,
    variables: {
      input: {
        lang: 'is-IS',
        slug: 'min-rettindi',
      },
    },
  })
  return {
    page,
  }
}
