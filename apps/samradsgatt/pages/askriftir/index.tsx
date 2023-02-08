import {
  Box,
  Breadcrumbs,
  Button,
  ContentBlock,
  GridContainer,
  ResponsiveSpace,
  Tabs,
  Text,
} from '@island.is/island-ui/core'
import SubscriptionTable from '../../components/Table/SubscriptionTable'
import { useState } from 'react'
import { Layout } from '../../components/Layout/Layout'
import Cases from '../../utils/dummydata/api/Cases'
import SubscriptionArray from '../../utils/dummydata/api/User/Subscriptions'
import Types from '../../utils/dummydata/api/Types'

const Subscriptions = () => {
  const [currentTab, setCurrentTab] = useState('Mál')
  const [casesData, setCasesData] = useState(Cases)
  const [institutionsData, setInstitutionsData] = useState(
    Object.entries(Types.institutions).map(([id, name]) => ({ id, name })),
  )
  const [subscriptionArray, setSubscriptionArray] = useState(SubscriptionArray)
  const settingSubscriptionArray = (newSubscriptionArray) =>
    setSubscriptionArray(newSubscriptionArray)
  const paddingYBreadCrumbs = [3, 3, 3, 5] as ResponsiveSpace
  const paddingXContent = [0, 0, 0, 15] as ResponsiveSpace
  const paddingXTable = [0, 0, 0, 15] as ResponsiveSpace
  const paddingBottom = [3, 3, 3, 3] as ResponsiveSpace

  const onLoadMore = () => {
    console.log("clicked on load more")
  }

  const CasesContent = () => {
    return (
      <SubscriptionTable
        data={casesData}
        currentTab={'Mál'}
        subscriptionArray={subscriptionArray}
        setSubscriptionArray={settingSubscriptionArray}
      />
    )
  }

  const InstitutionsContent = () => {
    return (
      <SubscriptionTable
        data={institutionsData}
        currentTab={'Stofnanir'}
        subscriptionArray={subscriptionArray}
        setSubscriptionArray={settingSubscriptionArray}
      />
    )
  }

  const tabTest = [
    {
      id: 'Mál',
      label: 'Mál',
      content: <CasesContent />,
      disabled: false,
    },
    {
      id: 'Stofnanir',
      label: 'Stofnanir',
      content: <InstitutionsContent />,
      disabled: false,
    },
  ]

  return (
    <Layout>
      <GridContainer>
        <Box paddingY={paddingYBreadCrumbs}>
          <Breadcrumbs
            items={[
              { title: 'Samráðsgátt', href: '/samradsgatt' },
              { title: 'Mínar áskriftir ', href: '/samradsgatt/askriftir' },
              { title: currentTab },
            ]}
          />
        </Box>
        <Box paddingX={paddingXContent} paddingBottom={3}>
          <Text variant="h1" color="dark400">
            {'Áskriftir'}
          </Text>
        </Box>
        <Box paddingX={paddingXContent} paddingBottom={5}>
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

        <Box paddingX={paddingXTable}>
          <Tabs
            selected={currentTab}
            onlyRenderSelectedTab={true}
            label="Veldu tegund áskrifta"
            tabs={tabTest}
            contentBackground="transparent"
            onChange={(e) => setCurrentTab(e)}
            
          />
        </Box>
        <Box
          paddingX={paddingXContent}
          paddingBottom={paddingBottom}
          paddingTop={3}
        >
          <Button icon="eye" variant="text" onClick={onLoadMore}>
            Sýna fleiri mál
          </Button>
        </Box>
      </GridContainer>
    </Layout>
  )
}

export default Subscriptions
