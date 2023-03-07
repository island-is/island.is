import {
  Box,
  Divider,
  GridContainer,
  ResponsiveSpace,
  Stack,
  Tabs,
  Text,
} from '@island.is/island-ui/core'
import TabContent from '../../components/Tab/TabContent'
import { useEffect, useState } from 'react'
import { Layout } from '../../components/Layout/Layout'
import { Cases, SubscriptionsArray, Types } from '../../utils/dummydata'
import {
  SubscriptionActionCard,
  ChosenSubscriptionCard,
} from '../../components/Card'
import { Area, SortOptions } from '../../types/enums'
import {
  ArrOfIdAndName,
  Case,
  SortTitle,
  SubscriptionArray,
} from '../../types/interfaces'
import BreadcrumbsWithMobileDivider from '../../components/BreadcrumbsWithMobileDivider/BreadcrumbsWithMobileDivider'
import { sorting } from '../../utils/helpers'

const Subscriptions = () => {
  // user logged in logic needed
  const [loggedIn, setLoggedIn] = useState(false)
  const [currentTab, setCurrentTab] = useState<Area>(Area.case)

  const [searchValue, setSearchValue] = useState('')

  const [casesData, setCasesData] = useState<Array<Case>>(Cases)
  const Institutions = Object.entries(Types.institutions).map(([id, name]) => ({
    id,
    name,
  }))
  const [institutionsData, setInstitutionsData] = useState(Institutions)
  const PolicyAreas = Object.entries(Types.policyAreas).map(([id, name]) => ({
    id,
    name,
  }))
  const [policyAreasData, setPolicyAreasData] = useState(PolicyAreas)

  const [subscriptionArray, setSubscriptionArray] = useState<SubscriptionArray>(
    SubscriptionsArray,
  )

  const [sortTitle, setSortTitle] = useState<SortTitle>({
    Mál: SortOptions.latest,
    Stofnanir: SortOptions.latest,
    Málefnasvið: SortOptions.latest,
  })

  const paddingX = [0, 0, 0, 8, 15] as ResponsiveSpace

  useEffect(() => {
    const sortedCases = sorting(Cases, sortTitle[Area.case])
    const sortedInstitutions = sorting(
      Institutions,
      sortTitle[Area.institution],
    )
    const sortedPolicyAreas = sorting(PolicyAreas, sortTitle[Area.policyArea])

    if (searchValue) {
      setCasesData(
        sortedCases.filter(
          (item) =>
            item.name.includes(searchValue) ||
            item.caseNumber.includes(searchValue) ||
            item.institutionName.includes(searchValue) ||
            item.policyAreaName.includes(searchValue),
        ),
      )
      setInstitutionsData(
        sortedInstitutions.filter((item) => item.name.includes(searchValue)),
      )
      setPolicyAreasData(
        sortedPolicyAreas.filter((item) => item.name.includes(searchValue)),
      )
    } else {
      setCasesData(sortedCases)
      setInstitutionsData(sortedInstitutions)
      setPolicyAreasData(sortedPolicyAreas)
    }
  }, [searchValue])

  const tabs = [
    {
      id: Area.case,
      label: Area.case,
      content: (
        <TabContent
          data={casesData}
          setData={(newData: Array<Case>) => setCasesData(newData)}
          currentTab={Area.case}
          subscriptionArray={subscriptionArray}
          setSubscriptionArray={(newSubscriptionArray: SubscriptionArray) =>
            setSubscriptionArray(newSubscriptionArray)
          }
          searchValue={searchValue}
          setSearchValue={(newValue: string) => setSearchValue(newValue)}
          sortTitle={sortTitle[Area.case]}
          setSortTitle={(val) => {
            const _sortTitle = { ...sortTitle }
            _sortTitle[Area.case] = val
            setSortTitle(_sortTitle)
          }}
        />
      ),
      disabled: false,
    },
    {
      id: Area.institution,
      label: Area.institution,
      content: (
        <TabContent
          data={institutionsData}
          setData={(newData: Array<ArrOfIdAndName>) =>
            setInstitutionsData(newData)
          }
          currentTab={Area.institution}
          subscriptionArray={subscriptionArray}
          setSubscriptionArray={(newSubscriptionArray: SubscriptionArray) =>
            setSubscriptionArray(newSubscriptionArray)
          }
          searchValue={searchValue}
          setSearchValue={(newValue: string) => setSearchValue(newValue)}
          sortTitle={sortTitle[Area.institution]}
          setSortTitle={(val) => {
            const _sortTitle = { ...sortTitle }
            _sortTitle[Area.institution] = val
            setSortTitle(_sortTitle)
          }}
        />
      ),
      disabled: false,
    },
    {
      id: Area.policyArea,
      label: Area.policyArea,
      content: (
        <TabContent
          data={policyAreasData}
          setData={(newData: Array<ArrOfIdAndName>) =>
            setPolicyAreasData(newData)
          }
          currentTab={Area.policyArea}
          subscriptionArray={subscriptionArray}
          setSubscriptionArray={(newSubscriptionArray: SubscriptionArray) =>
            setSubscriptionArray(newSubscriptionArray)
          }
          searchValue={searchValue}
          setSearchValue={(newValue: string) => setSearchValue(newValue)}
          sortTitle={sortTitle[Area.policyArea]}
          setSortTitle={(val) => {
            const _sortTitle = { ...sortTitle }
            _sortTitle[Area.policyArea] = val
            setSortTitle(_sortTitle)
          }}
        />
      ),
      disabled: false,
    },
  ]

  return (
    <Layout>
      <Divider />
      <Box background="blue100">
        <BreadcrumbsWithMobileDivider
          items={[
            { title: 'Samráðsgátt', href: '/samradsgatt' },
            { title: 'Mínar áskriftir ', href: '/samradsgatt/askriftir' },
            { title: currentTab },
          ]}
        />

        <GridContainer>
          <Box paddingX={paddingX} paddingBottom={3}>
            <Stack space={[3, 3, 3, 5, 5]}>
              <Stack space={3}>
                <Text variant="h1" color="dark400">
                  Áskriftir
                </Text>
                <Stack space={1}>
                  <Text variant="default">
                    Hér er hægt að skrá sig í áskrift að málum. Þú skráir þig
                    inn á Ísland.is, hakar við einn eða fleiri flokka, velur
                    hvort þú vilt tilkynningar um ný mál eða fleiri atriði og
                    smellir á „Staðfesta“. ferð svo og staðfestir áskriftina í
                    gegnum tölvupóstfangið sem þú varst að skrá.
                  </Text>
                  <Text variant="default">
                    Kerfið er uppfært einu sinni á sólarhring.
                  </Text>
                </Stack>
              </Stack>
              {loggedIn ? (
                <SubscriptionActionCard
                  userIsLoggedIn={true}
                  heading="Skrá áskrift"
                  text="Skráðu netfang hérna og svo hefst staðfestingaferlið. Þú færð tölvupóst sem þú þarft að staðfesta til að áskriftin taki gildi."
                  button={{
                    label: 'Skrá áskrift',
                    onClick: () => setLoggedIn(false),
                  }}
                  input={{
                    name: 'subscriptionEmail',
                    label: 'Netfang',
                    placeholder: 'Hér skal skrifa netfang',
                  }}
                />
              ) : (
                <SubscriptionActionCard
                  userIsLoggedIn={false}
                  heading="Skrá áskrift"
                  text="Þú verður að vera skráð(ur) inn til þess að geta skráð þig í áskrift."
                  button={{
                    label: 'Skrá mig inn',
                    onClick: () => setLoggedIn(true),
                  }}
                />
              )}
            </Stack>
            <Stack space={0}>
              {!(
                subscriptionArray.caseIds.length === 0 &&
                subscriptionArray.institutionIds.length === 0 &&
                subscriptionArray.policyAreaIds.length === 0
              ) && (
                <>
                  <Text paddingBottom={1} variant="eyebrow" paddingTop={2}>
                    Valin mál
                  </Text>
                  {subscriptionArray.caseIds.length !== 0 &&
                    subscriptionArray.caseIds.map((caseId) => {
                      return casesData
                        .filter((item) => caseId === item.id)
                        .map((filteredItem) => (
                          <ChosenSubscriptionCard
                            data={{
                              name: filteredItem.name,
                              caseNumber: filteredItem.caseNumber,
                              id: filteredItem.id.toString(),
                              area: Area.case,
                            }}
                            subscriptionArray={subscriptionArray}
                            setSubscriptionArray={(
                              newSubscriptionArray: SubscriptionArray,
                            ) => setSubscriptionArray(newSubscriptionArray)}
                            key={`case-${caseId}`}
                          />
                        ))
                    })}
                  {subscriptionArray.institutionIds.length !== 0 &&
                    subscriptionArray.institutionIds.map((institutionId) => {
                      return institutionsData
                        .filter((item) => institutionId.toString() === item.id)
                        .map((filteredItem) => (
                          <ChosenSubscriptionCard
                            data={{
                              name: filteredItem.name.toString(),
                              id: filteredItem.id,
                              area: Area.institution,
                            }}
                            subscriptionArray={subscriptionArray}
                            setSubscriptionArray={(
                              newSubscriptionArray: SubscriptionArray,
                            ) => setSubscriptionArray(newSubscriptionArray)}
                            key={`institution-${institutionId}`}
                          />
                        ))
                    })}
                  {subscriptionArray.policyAreaIds.length !== 0 &&
                    subscriptionArray.policyAreaIds.map((policyAreaId) => {
                      return policyAreasData
                        .filter((item) => policyAreaId.toString() === item.id)
                        .map((filteredItem) => (
                          <ChosenSubscriptionCard
                            data={{
                              name: filteredItem.name.toString(),
                              id: filteredItem.id,
                              area: Area.policyArea,
                            }}
                            subscriptionArray={subscriptionArray}
                            setSubscriptionArray={(
                              newSubscriptionArray: SubscriptionArray,
                            ) => setSubscriptionArray(newSubscriptionArray)}
                            key={`policyArea-${policyAreaId}`}
                          />
                        ))
                    })}
                </>
              )}
            </Stack>
          </Box>
        </GridContainer>
      </Box>
      <Divider />
      <GridContainer>
        <Box paddingX={paddingX} paddingTop={[3, 3, 3, 5, 5]}>
          <Tabs
            selected={currentTab}
            onlyRenderSelectedTab={true}
            label="Veldu tegund áskrifta"
            tabs={tabs}
            contentBackground="transparent"
            onChange={(e: Area) => setCurrentTab(e)}
          />
        </Box>
      </GridContainer>
    </Layout>
  )
}

export default Subscriptions
