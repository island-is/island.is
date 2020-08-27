import React from 'react'
import gql from 'graphql-tag'

import { Layout } from '@island.is/air-discount-scheme-web/components/Layout'
import {
  Query,
  GenericPage,
  QueryGetGenericPageArgs,
} from '@island.is/api/schema'
import { Box, Stack, Typography, Icon } from '@island.is/island-ui/core'
import {
  Content,
  IntroText,
} from '@island.is/air-discount-scheme-web/components'
import { Screen } from '../../types'
import { Benefits, Usage } from './components'
import {
  Table,
  Row,
  Head,
  HeadData,
  Body,
  Data,
} from '@island.is/air-discount-scheme-web/components/Table/Table'

interface PropTypes {
  page?: GenericPage
}

const Subsidy: Screen<PropTypes> = ({
  page: { title, intro, mainContent, sidebar, misc },
}) => {
  const { attention, codeDisclaimer } = JSON.parse(misc)

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
            <Box
              marginBottom={4}
              background="blue100"
              borderRadius="standard"
              display="flex"
              alignItems="center"
              padding={3}
            >
              <Icon type="alert" color="blue400" />
              <Box marginLeft={1} marginRight={2}>
                <Typography variant="p">
                  <strong>{attention}</strong>
                </Typography>
              </Box>
              <Typography variant="p">{codeDisclaimer}</Typography>
            </Box>
          </Stack>
          <Benefits misc={misc} />
          <Usage misc={misc} />
          <Table>
            <Head>
              <Row>
                <HeadData>Notandi</HeadData>
                <HeadData>Leggur</HeadData>
                <HeadData>Dagsetning</HeadData>
              </Row>
            </Head>
            <Body>
              <Row>
                <Data>The table body</Data>
                <Data>with two columns</Data>
                <Data>with two columns</Data>
              </Row>
            </Body>
          </Table>
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

Subsidy.getInitialProps = async ({ apolloClient, locale }) => {
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
