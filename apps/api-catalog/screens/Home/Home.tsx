import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Layout, Header } from '../../components'
import {
  Page,
  Box,
  ContentBlock,
  Stack,
  Typography,
  Button,
  Footer
} from '@island.is/island-ui/core'

function Home() {
  return (
    <Page>
      <Head>
        <title>Ísland.is</title>
      </Head>
      <Box paddingX="gutter">
        <ContentBlock>
          <Header />
        </ContentBlock>
      </Box>
      <Layout left={
        <Box>
          <Box marginBottom={[3, 3, 3, 12]} marginTop={1}>
            <Stack space={5}>
              <Stack space={3}>
                <Typography variant="h1">
                  Viskuausan
                </Typography>
              </Stack>
              <Stack space={3}>
                <Typography variant="intro">
                  Hér getur þú leitað í 137 vefþjónustum og 75 gagnaskilgreiningum
                  hjá hinu opinbera
                </Typography>
              </Stack>
              <Stack space={3}>
                <Link href="/design-guide">
                  <Button variant="text" icon="arrowRight">
                    API Design Guide
                  </Button>
                </Link>
              </Stack>
            </Stack>
          </Box>
        </Box>
      } />
      <Footer 
        hideLanguageSwith
      />
    </Page>
  )
}

export default Home