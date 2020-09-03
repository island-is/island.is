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
  { name:"Þjóðskrá",     owner:"Fasteignaskrá",     pricing:null, categories:null, type:["REST"], access:["API GW"]},
  { name:"serviceName1", owner:"serviceOwnerName1", pricing:["free", "custom"], categories:null, type:null, access:["API GW"]},
  { name:"serviceName2", owner:"serviceOwnerName2", pricing:null, categories:["personal", "public"], type:["react"], access:["API GW"]},
  { name:"serviceName3", owner:"serviceOwnerName3", pricing:["daily","monthly", "yearly"], categories:["personal", "public"], type:["SOAP"], access:["API GW"]}
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
                  services.map( (item, index) => {
                    return <ServiceCard key={index} service={item} />
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