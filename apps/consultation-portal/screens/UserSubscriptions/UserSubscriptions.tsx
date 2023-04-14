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
interface SubProps {
  subscriptions: any
  cases: CaseForSubscriptions[]
  types: ArrOfTypesForSubscriptions
  isNotAuthorized: boolean
}

export const UserSubscriptions = ({
  cases,
  subscriptions,
  types,
  isNotAuthorized,
}: SubProps) => {
  const [currentTab, setCurrentTab] = useState<Area>(Area.case)

  const [searchValue, setSearchValue] = useState('')

  const [casesData, setCasesData] = useState<Array<CaseForSubscriptions>>(
    subscriptions,
  )
  const { Institutions, PolicyAreas } = getInitValues({ types: types })
  const [typeData, setTypeData] = useState<Array<TypeForSubscriptions>>(
    GeneralSubscriptionArray,
  )

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
    const sortedCases = sorting(subscriptions, sortTitle[Area.case])
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
export default UserSubscriptions
