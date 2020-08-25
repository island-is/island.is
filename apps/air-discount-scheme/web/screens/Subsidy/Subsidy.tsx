import React from 'react'
import gql from 'graphql-tag'
import { Screen } from '../../types'
import { Layout } from '@island.is/air-discount-scheme-web/components/Layout'
import {
  Query,
  GenericPage,
  QueryGetGenericPageArgs,
} from '@island.is/api/schema'
import { Box, Stack, Typography, Icon, Button } from '@island.is/island-ui/core'
import {
  Content,
  IntroText,
} from '@island.is/air-discount-scheme-web/components'

export interface SubsidyProps {
  page?: GenericPage
}

const codes: {
  name: string
  kid: boolean
  code: string
  remainingCodes: number
  totalCodes: number
}[] = [
  {
    name: 'Jón Jónsson',
    kid: false,
    code: 'ASFEWFA',
    remainingCodes: 3,
    totalCodes: 6,
  },
  {
    name: 'Jón Jónsson',
    kid: true,
    code: 'ASssWFA',
    remainingCodes: 6,
    totalCodes: 6,
  },
]

const copyToClipboard = (str) => {
  const el = document.createElement('textarea')
  el.value = str
  el.setAttribute('readonly', '')
  el.style.position = 'absolute'
  el.style.opacity = '0'
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
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
            <Typography variant="h3">{myRights}</Typography>
            {codes.map(({ name, kid, code, remainingCodes, totalCodes }) => {
              const remainingPlaceholders = {
                remaining: remainingCodes,
                total: totalCodes,
              }
              return (
                <Box
                  key={code}
                  padding={2}
                  marginBottom={2}
                  border="standard"
                  borderRadius="standard"
                  display={['block', 'flex']}
                  justifyContent="spaceBetween"
                  alignItems={['flexStart', 'center']}
                  background="blue100"
                  flexDirection={['column', 'row']}
                >
                  <Box marginBottom={[3, 0]}>
                    <Typography variant="h3">
                      {name} {kid && kidsRights}
                    </Typography>
                    <Typography variant="p">
                      {remaining.replace(
                        /\{{(.*?)\}}/g,
                        (m, sub) => remainingPlaceholders[sub],
                      )}
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent={['spaceBetween', 'flexStart']}
                  >
                    <Box marginRight={[2, 4]}>
                      <Typography variant="h3" color="roseTinted400">
                        {code}
                      </Typography>
                    </Box>
                    <Button
                      noWrap
                      onClick={() => {
                        copyToClipboard(code)
                      }}
                    >
                      {copyCode}
                    </Button>
                  </Box>
                </Box>
              )
            })}
          </Stack>
          <Box textAlign="right" marginBottom={4}>
            <Typography variant="pSmall">{codeDescription}</Typography>
          </Box>
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
