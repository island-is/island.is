import {
    Box,
    Breadcrumbs,
    GridContainer,
    GridRow,
    ResponsiveSpace,
    Text,
  } from '@island.is/island-ui/core'
  import SubscriptionTable from '../../components/Table/SubscriptionTable'
  import { useState } from 'react'
  import { useLocation } from 'react-use'
  import { Layout } from '../../components/Layout/Layout'
  
  const Subscriptions = () => {
    const location = useLocation()
    const [currentTab, setCurrentTab] = useState('Mál')
    const paddingXBreadCrumbs = [3, 3, 3, 4] as ResponsiveSpace
    const paddingYBreadCrumbs = [3, 3, 3, 5] as ResponsiveSpace
    const paddingXContent = [3, 3, 3, 22] as ResponsiveSpace
    const paddingXTable = [0, 0, 0, 22] as ResponsiveSpace
    const paddingBottom = [5, 5, 5, 5] as ResponsiveSpace
  
    return (
      <Layout>
        <GridContainer>
            <GridRow>
                <Box paddingY={paddingYBreadCrumbs} paddingX={paddingXBreadCrumbs}>
                    <Breadcrumbs
                    items={[
                        { title: 'Samráðsgátt', href: '/samradsgatt' },
                        { title: 'Mínar áskriftir ', href: location.href },
                        { title: currentTab, href: `${location.href}/${currentTab}` },
                    ]}
                    />
                </Box>
            </GridRow>
            <GridRow>
                <Box paddingX={paddingXContent} paddingBottom={paddingBottom}>
                    <Text variant="h1" color="dark400">
                    {'Áskriftir'}
                    </Text>
                </Box>
            </GridRow>
            <GridRow>
                <Box paddingX={paddingXContent} paddingBottom={paddingBottom}>
                    <Text variant="default">
                    {
                        'Hér er hægt að skrá sig í áskrift að málum. Þú skráir þig inn á Ísland.is, \
                        hakar við einn eða fleiri flokka, velur hvort þú vilt tilkynningar um ný mál \
                        eða fleiri atriði og smellir á „Staðfesta“. ferð svo og staðfestir áskriftina \
                        í gegnum tölvupóstfangið sem þú varst að skrá.'
                    }
                    </Text>
                    <Text variant="default" paddingTop={2}>
                        {'Kerfið er uppfært einu sinni á sólarhring.'}
                    </Text>
                </Box>
            </GridRow>
          <GridRow>
            <Box paddingX={paddingXTable}>
                <SubscriptionTable />
            </Box>
          </GridRow>
        </GridContainer>
      </Layout>
    )
  }
  
  export default Subscriptions
  
  