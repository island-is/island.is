import {
  AsyncSearch,
  AsyncSearchOption,
  Box,
  Breadcrumbs,
  Button,
  GridContainer,
  ResponsiveSpace,
  Tabs,
  Text,
} from '@island.is/island-ui/core'
import SubscriptionTable from '../../components/Table/SubscriptionTable'
import TabContent from '../../components/Tab/TabContent'
import { useEffect, useState } from 'react'
import { Layout } from '../../components/Layout/Layout'
import Cases from '../../utils/dummydata/api/Cases'
import SubscriptionArray from '../../utils/dummydata/api/User/Subscriptions'
import Types from '../../utils/dummydata/api/Types'

const Subscriptions = () => {
  const [currentTab, setCurrentTab] = useState('Mál')

  useEffect(() => {
    console.log('currentTab', currentTab)
    if (currentTab === 'Mál') {
      console.log('Mál')
    } else if (currentTab === 'Stofnanir') {
      console.log('Stofnanir')
    } else if (currentTab === 'Málefnasvið') {
      console.log('Málefnasvið')
    }
  }, [currentTab])

  const [searchOptions, setSearchOptions] = useState<AsyncSearchOption[]>([])
  const [searchValue, setSearchValue] = useState('')
  const settingSearchValue = (val) => setSearchValue(val)
  const [prevSearchValue, setPrevSearchValue] = useState('')

  const [casesData, setCasesData] = useState(Cases)
  const [institutionsData, setInstitutionsData] = useState(
    Object.entries(Types.institutions).map(([id, name]) => ({ id, name })),
  )
  const [policyAreasData, setPolicyAreasData] = useState(
    Object.entries(Types.policyAreas).map(([id, name]) => ({ id, name })),
  )
  const [subscriptionArray, setSubscriptionArray] = useState(SubscriptionArray)
  const settingSubscriptionArray = (newSubscriptionArray) =>
    setSubscriptionArray(newSubscriptionArray)

  const paddingYBreadCrumbs = [3, 3, 3, 5] as ResponsiveSpace
  const paddingXContent = [0, 0, 0, 15] as ResponsiveSpace
  const paddingXTable = [0, 0, 0, 15] as ResponsiveSpace
  const paddingBottom = [3, 3, 3, 3] as ResponsiveSpace



  const clearAll = () => {
    // setOptions([])
    // setData
  }

  // useEffect(() => {
  //   console.log("searchValue", searchValue)
  //   if(!searchValue) {
  //     clearAll()
  //   } else if (searchValue != prevSearchValue) {
  //     console.log("not the same")
  //   }
  // }, [searchValue, currentTab])

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

  const PolicyAreasContent = () => {
    return (
      <SubscriptionTable
        data={policyAreasData}
        currentTab={'Málefnasvið'}
        subscriptionArray={subscriptionArray}
        setSubscriptionArray={settingSubscriptionArray}
      />
    )
  }

  const tabs = [
    {
      id: 'Mál',
      label: 'Mál',
      content: (
        <TabContent
          data={casesData}
          currentTab={'Mál'}
          subscriptionArray={subscriptionArray}
          setSubscriptionArray={settingSubscriptionArray}
          searchOptions={searchOptions}
          searchValue={searchValue}
          setSearchValue={settingSearchValue}
          searchPlaceholder={'Leitaðu að máli, stofnun eða málefnasviði'}
        />
      ),
      disabled: false,
    },
    {
      id: 'Stofnanir',
      label: 'Stofnanir',
      content: (
        <TabContent
          data={institutionsData}
          currentTab={'Stofnanir'}
          subscriptionArray={subscriptionArray}
          setSubscriptionArray={settingSubscriptionArray}
          searchOptions={searchOptions}
          searchValue={searchValue}
          setSearchValue={settingSearchValue}
          searchPlaceholder={'Leitaðu að máli, stofnun eða málefnasviði'}
        />
      ),
      disabled: false,
    },
    {
      id: 'Málefnasvið',
      label: 'Málefnasvið',
      content: (
        <TabContent
          data={policyAreasData}
          currentTab={'Málefnasvið'}
          subscriptionArray={subscriptionArray}
          setSubscriptionArray={settingSubscriptionArray}
          searchOptions={searchOptions}
          searchValue={searchValue}
          setSearchValue={settingSearchValue}
          searchPlaceholder={'Leitaðu að máli, stofnun eða málefnasviði'}
        />
      ),
      disabled: false,
    },
  ]

  console.log('searchValue', searchValue)

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
            tabs={tabs}
            contentBackground="transparent"
            onChange={(e) => setCurrentTab(e)}
          />
        </Box>
      </GridContainer>
    </Layout>
  )
}

export default Subscriptions
