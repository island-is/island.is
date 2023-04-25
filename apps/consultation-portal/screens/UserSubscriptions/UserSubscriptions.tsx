import {
  Box,
  Button,
  Divider,
  GridContainer,
  LoadingDots,
  ResponsiveSpace,
  Stack,
  Tabs,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useEffect, useState } from 'react'
import { Layout } from '../../components/Layout/Layout'
import {
  GeneralSubscriptionArray,
  SubscriptionsArray,
} from '../../utils/dummydata'
import { ChosenSubscriptionCard } from '../../components/Card'
import { Area, SortOptions } from '../../types/enums'
import {
  ArrOfIdAndName,
  ArrOfTypesForSubscriptions,
  CaseForSubscriptions,
  SortTitle,
  SubscriptionArray,
  TypeForSubscriptions,
} from '../../types/interfaces'
import { BreadcrumbsWithMobileDivider } from '../../components/BreadcrumbsWithMobileDivider'
import { sorting } from '../../utils/helpers'
import getInitValues from '../Subscriptions/getInitValues'
import TabsList from '../Subscriptions/tabsList'
import { useFetchSubscriptions } from '../../utils/helpers/api/useFetchSubscriptions'
import { IconLink } from '../../components/IconLink/IconLink'
interface SubProps {
  allcases: CaseForSubscriptions[]
  types: ArrOfTypesForSubscriptions
  isNotAuthorized: boolean
}

export const UserSubscriptions = ({
  allcases,
  types,
  isNotAuthorized,
}: SubProps) => {
  const [currentTab, setCurrentTab] = useState<Area>(Area.case)
  const {
    cases,
    policyAreas,
    institutions,
    subscribedToAll,
    subscribedToAllNew,
    getUserSubsLoading,
  } = useFetchSubscriptions()
  const [searchValue, setSearchValue] = useState('')

  const [casesData, setCasesData] = useState<Array<CaseForSubscriptions>>()
  const { Institutions, PolicyAreas } = getInitValues({ types: types })
  const [typeData, setTypeData] = useState<Array<TypeForSubscriptions>>(
    GeneralSubscriptionArray,
  )
  const [institutionsData, setInstitutionsData] = useState([])
  let generalSubData: any = []
  const [policyAreasData, setPolicyAreasData] = useState([])

  const [subscriptionArray, setSubscriptionArray] = useState<SubscriptionArray>(
    SubscriptionsArray,
  )
  const {
    caseIds,
    policyAreaIds,
    institutionIds,
    generalSubscription,
  } = subscriptionArray
  useEffect(() => {
    if (!getUserSubsLoading) {
      if (subscribedToAll) {
        generalSubData = GeneralSubscriptionArray.at(0)
      } else if (subscribedToAllNew) {
        generalSubData = GeneralSubscriptionArray.at(1)
      }
      const filteredInst = Object.values(institutionsData).filter(function (
        item,
      ) {
        return institutions.filter((x) => x.id == item.id).length > 0
      })

      setInstitutionsData(filteredInst)

      const filteredPlicy = Object.values(policyAreasData).filter(function (
        item,
      ) {
        return policyAreas.filter((x) => x.id == item.id).length > 0
      })

      setPolicyAreasData(filteredPlicy)

      const filteredCases = allcases.filter(function (item) {
        return cases.filter((x) => x.id == item.id).length > 0
      })

      setCasesData(filteredCases)
    }
  }, [getUserSubsLoading])
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
  const onSubmit = () => {
    toast.success('Áskrift uppfærð')

    setSubscriptionArray(SubscriptionsArray)
  }
  const onClear = () => {
    setSubscriptionArray(SubscriptionsArray)
  }
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
    generalSubArray: generalSubData,
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
    <Layout
      seo={{ title: 'Mínar áskriftir', url: 'minaraskriftir' }}
      justifyContent="flexStart"
    >
      <Divider />
      <Box background="blue100">
        <BreadcrumbsWithMobileDivider
          items={[
            { title: 'Samráðsgátt', href: '/samradsgatt' },
            {
              title: 'Áskriftir ',
              href: '/samradsgatt/askriftir',
            },
            {
              title: 'Mínar áskriftir ',
              href: '/samradsgatt/minaraskriftir',
            },
          ]}
        />

        <GridContainer>
          <Box paddingX={paddingX} paddingBottom={3}>
            <Stack space={[3, 3, 3, 5, 5]}>
              <Stack space={3}>
                <Text variant="h1" color="dark400">
                  Mínar Áskriftir
                </Text>
                <Stack space={1}>
                  <Text variant="default">
                    Hér er hægt að halda utan um áskriftir og skrá sig úr
                    áskriftum. Aðeins birtast virk mál.
                  </Text>
                  <Text variant="default">
                    Kerfið er uppfært einu sinni á sólarhring.
                  </Text>
                </Stack>
              </Stack>
            </Stack>
            <Stack space={0}>
              {!(
                caseIds.length === 0 &&
                institutionIds.length === 0 &&
                policyAreaIds.length === 0 &&
                generalSubscription.length === 0
              ) && (
                <>
                  <Text paddingBottom={1} variant="eyebrow" paddingTop={2}>
                    Valin mál
                  </Text>
                  {generalSubscription.length !== 0 &&
                    typeData
                      .filter((item) => generalSubscription == item.id)
                      .map((filteredItem) => {
                        return (
                          <ChosenSubscriptionCard
                            data={{
                              name: filteredItem.name,
                              caseNumber: filteredItem.nr,
                              id: filteredItem.id.toString(),
                              area: Area.case,
                            }}
                            subscriptionArray={subscriptionArray}
                            setSubscriptionArray={(
                              newSubscriptionArray: SubscriptionArray,
                            ) => setSubscriptionArray(newSubscriptionArray)}
                            key={`type-${filteredItem.nr}`}
                          />
                        )
                      })}
                  {caseIds.length !== 0 &&
                    caseIds.map((caseId) => {
                      return casesData
                        .filter((item) => caseId.id === item.id)
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
                  {institutionIds.length !== 0 &&
                    institutionIds.map((institutionId) => {
                      return Object.values(institutionsData).map(
                        (filteredItem) => {
                          if (filteredItem.id == institutionId.id.toString()) {
                            return (
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
                            )
                          }
                        },
                      )
                    })}
                  {policyAreaIds.length !== 0 &&
                    policyAreaIds.map((policyAreaId) => {
                      return Object.values(policyAreasData)
                        .filter(
                          (item) => policyAreaId.id.toString() === item.id,
                        )
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
                  <Box
                    marginTop={1}
                    display={'flex'}
                    justifyContent={'flexEnd'}
                    alignItems="center"
                  >
                    <Box marginRight={3}>
                      <IconLink
                        icon={{ icon: 'reload', size: 'small' }}
                        onClick={onClear}
                      >
                        Hreinsa val
                      </IconLink>
                    </Box>
                    <Button size="small" onClick={onSubmit}>
                      Skrá úr áskrift
                    </Button>
                  </Box>
                </>
              )}
            </Stack>
          </Box>
        </GridContainer>
      </Box>
      <Divider />
      <GridContainer>
        <Box paddingX={paddingX} paddingTop={[3, 3, 3, 5, 5]}>
          {getUserSubsLoading ? (
            <LoadingDots></LoadingDots>
          ) : (
            <Tabs
              selected={currentTab}
              onlyRenderSelectedTab={true}
              label="Veldu tegund áskrifta"
              tabs={tabs}
              contentBackground="transparent"
              onChange={(e: Area) => setCurrentTab(e)}
            />
          )}
        </Box>
      </GridContainer>
    </Layout>
  )
}
export default UserSubscriptions
