import {
    Box,
    Breadcrumbs,
    GridContainer,
    Text,
  } from '@island.is/island-ui/core'
  import SubscriptionTable from '../../components/Table/SubscriptionTable'
  import { useState } from 'react'
  import { useLocation } from 'react-use'
  import { Layout } from '../../components/Layout/Layout'
  
  const Subscriptions = () => {
    const location = useLocation()
    const [currentTab, setCurrentTab] = useState('Mál')
  
    return (
      <Layout>
        <GridContainer>
          <Box paddingY={4}>
            <Breadcrumbs
              items={[
                { title: 'Samráðsgátt', href: '/samradsgatt' },
                { title: 'Mínar áskriftir ', href: location.href },
                { title: currentTab, href: `${location.href}/${currentTab}` },
              ]}
            />
          </Box>
          <Box>
            <Text variant="h1" color="dark400">
              {'Áskriftir'}
            </Text>
            <Text variant="default">
              {
                'Hér er hægt að skrá sig í áskrift að málum. Þú skráir þig inn á Ísland.is, \
                hakar við einn eða fleiri flokka, velur hvort þú vilt tilkynningar um ný mál \
                eða fleiri atriði og smellir á „Staðfesta“. ferð svo og staðfestir áskriftina \
                í gegnum tölvupóstfangið sem þú varst að skrá. Kerfið er uppfært einu sinni á sólarhring.'
              }
            </Text>
          </Box>
          <Box>
            <SubscriptionTable />
          </Box>
        </GridContainer>
      </Layout>
    )
  }
  
  export default Subscriptions
  
  