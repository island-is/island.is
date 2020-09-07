import React from 'react'
import Head from 'next/head'
import { Layout, Header, Card } from '../../components'
import {
  Page,
  Box,
  ContentBlock,
  Stack,
  Typography,
  Footer,
  Tiles
} from '@island.is/island-ui/core'

function Home({cards}) {
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
                <Tiles space={3} columns={3}>
                  {
                    cards.map((item, index) => {
                      return <Card key={index} card={item} />
                    }) 
                  }
                </Tiles>
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

Home.getInitialProps = () => {
  const cards = [
    { title: "Services", slug: "/services" },
    { title: "Data Models", slug: "/data-models" },
    { title: "API Design Guide", slug: "/design-guide" }
  ]

  return {cards:cards}
}

export default Home