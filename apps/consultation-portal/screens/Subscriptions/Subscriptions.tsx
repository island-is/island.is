import {
  Box,
  Divider,
  GridContainer,
  ResponsiveSpace,
  Stack,
  Tabs,
  Text,
} from '@island.is/island-ui/core'
import { useEffect, useState } from 'react'
import { Layout } from '../../components/Layout/Layout'
import { SubscriptionsArray } from '../../utils/dummydata'
import { ChosenSubscriptionCard } from '../../components/Card'
import { Area, SortOptions } from '../../types/enums'
import {
  ArrOfIdAndName,
  ArrOfTypesForSubscriptions,
  CaseForSubscriptions,
  SortTitle,
  SubscriptionArray,
} from '../../types/interfaces'
import { BreadcrumbsWithMobileDivider } from '../../components/BreadcrumbsWithMobileDivider'
import { sorting } from '../../utils/helpers'
import getInitValues from './getInitValues'
import TabsList from './tabsList'
import EmailBox from '../../components/EmailBox/EmailBox'

interface SubProps {
  cases: CaseForSubscriptions[]
  types: ArrOfTypesForSubscriptions
}

const SubscriptionsScreen = ({ cases, types }: SubProps) => {
  const [currentTab, setCurrentTab] = useState<Area>(Area.case)

  const [searchValue, setSearchValue] = useState('')

  const [casesData, setCasesData] = useState<Array<CaseForSubscriptions>>(cases)

  const { Institutions, PolicyAreas } = getInitValues({ types: types })

  const [institutionsData, setInstitutionsData] = useState(Institutions)

  const [policyAreasData, setPolicyAreasData] = useState(PolicyAreas)

  const [subscriptionArray, setSubscriptionArray] = useState<SubscriptionArray>(
    SubscriptionsArray,
  )

  const [sortTitle, setSortTitle] = useState<SortTitle>({
    Mál: SortOptions.latest,
    Stofnanir: SortOptions.aToZ,
    Málefnasvið: SortOptions.aToZ,
  })

  const paddingX = [0, 0, 0, 8, 15] as ResponsiveSpace

  useEffect(() => {
    const sortedCases = sorting(cases, sortTitle[Area.case])
    const sortedInstitutions = sorting(
      Institutions,
      sortTitle[Area.institution],
    )
    const sortedPolicyAreas = sorting(PolicyAreas, sortTitle[Area.policyArea])
    const lowerCaseSearchValue = searchValue.toLocaleLowerCase()

    if (searchValue) {
      setCasesData(
        sortedCases.filter(
          (item) =>
            item.name.toLocaleLowerCase().includes(lowerCaseSearchValue) ||
            item.caseNumber
              .toLocaleLowerCase()
              .includes(lowerCaseSearchValue) ||
            item.institutionName
              .toLocaleLowerCase()
              .includes(lowerCaseSearchValue) ||
            item.policyAreaName
              .toLocaleLowerCase()
              .includes(lowerCaseSearchValue),
        ),
      )
      setInstitutionsData(
        sortedInstitutions.filter((item) =>
          item.name.toLocaleLowerCase().includes(lowerCaseSearchValue),
        ),
      )
      setPolicyAreasData(
        sortedPolicyAreas.filter((item) =>
          item.name.toLocaleLowerCase().includes(lowerCaseSearchValue),
        ),
      )
    } else {
      setCasesData(sortedCases)
      setInstitutionsData(sortedInstitutions)
      setPolicyAreasData(sortedPolicyAreas)
    }
  }, [searchValue])

  const tabs = TabsList({
    casesData: casesData,
    setCasesData: (arr: Array<CaseForSubscriptions>) => setCasesData(arr),
    institutionsData: institutionsData,
    setInstitutionsData: (arr: Array<ArrOfIdAndName>) =>
      setInstitutionsData(arr),
    policyAreasData: policyAreasData,
    setPolicyAreasData: (arr: Array<ArrOfIdAndName>) => setPolicyAreasData(arr),
    Area: Area,
    subscriptionArray: subscriptionArray,
    setSubscriptionArray: (arr: SubscriptionArray) => setSubscriptionArray(arr),
    searchValue: searchValue,
    setSearchValue: (value: string) => setSearchValue(value),
    sortTitle: sortTitle,
    setSortTitle: (value: SortOptions) => {
      const _sortTitle = { ...sortTitle }
      _sortTitle[Area.case] = value
      setSortTitle(_sortTitle)
    },
  })
  return (
    <Layout seo={{ title: 'Áskriftir', url: 'askriftir' }}>
      <Divider />
      <Box background="blue100">
        <BreadcrumbsWithMobileDivider
          items={[
            { title: 'Samráðsgátt', href: '/samradsgatt' },
            { title: 'Mínar áskriftir ', href: '/samradsgatt/askriftir' },
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
                    inn á Ísland.is, hakar við einn eða fleiri flokka
                    (mál/stofnanir/málefnasvið), velur hvort þú vilt
                    tilkynningar um ný mál eða fleiri atriði og smellir á
                    „Staðfesta“. Loks þarftu að staðfesta áskriftina í gegnum
                    tölvupóstfangið sem þú skráðir.
                  </Text>
                  <Text variant="default">
                    Kerfið er uppfært einu sinni á sólarhring.
                  </Text>
                </Stack>
              </Stack>
              <EmailBox />
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

export default SubscriptionsScreen
