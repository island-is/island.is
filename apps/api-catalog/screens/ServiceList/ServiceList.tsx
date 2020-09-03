import React from 'react'
import Head from 'next/head'
import { Layout, Header, ServiceCard } from '../../components'
import {
  Page,
  Box,
  ContentBlock,
  Stack,
  Typography,
  Footer
} from '@island.is/island-ui/core'

const services = [
  { name:"serviceName1", owner:"serviceOwnerName1", pricing:["free", "custom"], categories:null, type:null},
  { name:"serviceName2", owner:"serviceOwnerName2", pricing:null, categories:["personal", "public"], type:["react"]},
  { name:"serviceName3", owner:"serviceOwnerName3", pricing:["daily","monthly", "yearly"], categories:["personal", "public"], type:["SOAP"]}
];

function ServiceList() {
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
                  Vefþjónustur
                </Typography>
              </Stack>
              <Stack space={3}>
                {
                  services.map( (item) => {
                    return <ServiceCard service={item} />
                  })
                }
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

export default ServiceList