import React from 'react'
import gql from 'graphql-tag'

import { Layout } from '@island.is/air-discount-scheme-web/components/Layout'
import {
  Query,
  GenericPage,
  QueryGetGenericPageArgs,
} from '@island.is/api/schema'
import {
  Box,
  Stack,
  Typography,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import {
  Content,
  IntroText,
} from '@island.is/air-discount-scheme-web/components'
import { Screen } from '../../types'
import { Benefits, Usage } from './components'

interface PropTypes {
  page?: GenericPage
}

const Subsidy: Screen<PropTypes> = ({
  page: { title, intro, mainContent, sidebar, misc },
}) => {
  return (
    <Layout
      main={
        <GridRow>
          <GridColumn
            span={['12/12', '12/12', '12/12', '12/12', '7/9']}
            offset={[null, null, null, null, '1/9']}
          >
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
                <Benefits misc={misc} />
              </Stack>
              <Usage misc={misc} />
            </Box>
          </GridColumn>
        </GridRow>
      }
      aside={
        <Content
          document={sidebar}
          wrapper={(children) => <Stack space={3}>{children}</Stack>}
        />
      }
    />
  )
}

const GetGenericPageQuery = gql`
  query getGenericPageQuery($input: GetGenericPageInput!) {
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

Subsidy.getInitialProps = async ({ apolloClient }) => {
  const {
    data: { getGenericPage: page },
  } = await apolloClient.query<Query, QueryGetGenericPageArgs>({
    query: GetGenericPageQuery,
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

export default Subsidy
