import { toast } from '@island.is/island-ui/core'
import { useEffect, useState } from 'react'
import {
  GeneralSubscriptionArray,
  SubscriptionsArray,
} from '../../utils/dummydata'
import { Area, SortOptions } from '../../types/enums'
import {
  ArrOfIdAndName,
  ArrOfTypesForSubscriptions,
  CaseForSubscriptions,
  GeneralSubscription,
  SortTitle,
  SubscriptionArray,
  TypeForSubscriptions,
} from '../../types/interfaces'
import { useSearchSubscriptions, useUser } from '../../utils/helpers'
import getInitValues from '../Subscriptions/getInitValues'
import TabsList from '../Subscriptions/tabsList'
import { useFetchSubscriptions } from '../../utils/helpers/api/useFetchSubscriptions'
import ChosenSubscriptions from '@island.is/consultation-portal/components/ChosenSubscriptions/ChosenSubscriptions'
import SubscriptionsSkeleton from '@island.is/consultation-portal/components/SubscriptionsSkeleton/SubscriptionsSkeleton'

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
  const { isAuthenticated, userLoading } = useUser()
  const [currentTab, setCurrentTab] = useState<Area>(Area.case)
  const [generalSubData, setGeneralSubData] = useState<GeneralSubscription>()
  const { Institutions, PolicyAreas } = getInitValues({ types: types })
  const [initCases, setInitCases] = useState<Array<CaseForSubscriptions>>()
  const [casesData, setCasesData] = useState<Array<CaseForSubscriptions>>()
  const [typeData, setTypeData] = useState<Array<TypeForSubscriptions>>(
    GeneralSubscriptionArray,
  )
  const [initInstitutions, setInitInstitutions] = useState<
    Array<ArrOfIdAndName>
  >([])
  const [institutionsData, setInstitutionsData] = useState<
    Array<ArrOfIdAndName>
  >([])
  const [initPolicyAreas, setInitPolicyAreas] = useState<Array<ArrOfIdAndName>>(
    [],
  )
  const [policyAreasData, setPolicyAreasData] = useState<Array<ArrOfIdAndName>>(
    [],
  )
  const [subscriptionArray, setSubscriptionArray] = useState<SubscriptionArray>(
    SubscriptionsArray,
  )

  const [sortTitle, setSortTitle] = useState<SortTitle>({
    Mál: SortOptions.latest,
    Stofnanir: SortOptions.aToZ,
    Málefnasvið: SortOptions.aToZ,
  })

  const [searchValue, setSearchValue] = useState('')

  const {
    cases,
    policyAreas,
    institutions,
    subscribedToAll,
    subscribedToAllNew,
    getUserSubsLoading,
  } = useFetchSubscriptions({ isAuthenticated: isAuthenticated })

  const { searchIsLoading } = useSearchSubscriptions({
    searchValue: searchValue,
    initCasesData: initCases,
    sortTitle: sortTitle,
    initInstitutions: initInstitutions,
    initPolicyAreas: initPolicyAreas,
    setCasesData: setCasesData,
    setInstitutionsData: setInstitutionsData,
    setPolicyAreasData: setPolicyAreasData,
  })

  useEffect(() => {
    if (!getUserSubsLoading) {
      if (subscribedToAll) {
        setGeneralSubData(GeneralSubscriptionArray.at(0))
      } else if (subscribedToAllNew) {
        setGeneralSubData(GeneralSubscriptionArray.at(1))
      }

      const filteredInstitutions = Institutions.filter((item) =>
        institutions.find((i) => i.id.toString() === item.id),
      )
      const filteredPolicyAreas = PolicyAreas.filter((item) =>
        policyAreas.find((i) => i.id.toString() === item.id),
      )
      const filteredCases = allcases.filter((item) =>
        cases.find((i) => i.id === item.id),
      )

      setInitInstitutions(filteredInstitutions)
      setInstitutionsData(filteredInstitutions)
      setInitPolicyAreas(filteredPolicyAreas)
      setPolicyAreasData(filteredPolicyAreas)
      setInitCases(filteredCases)
      setCasesData(filteredCases)
    }
  }, [getUserSubsLoading])

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

  if (!userLoading && !isAuthenticated) {
    return (
      <SubscriptionsSkeleton
        isMySubscriptions
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        tabs={tabs}
        getUserSubsLoading={true}
      >
        <></>
      </SubscriptionsSkeleton>
    )
  }

  return (
    <SubscriptionsSkeleton
      isMySubscriptions
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      tabs={tabs}
      getUserSubsLoading={getUserSubsLoading}
    >
      <ChosenSubscriptions
        subscriptionArray={subscriptionArray}
        typeData={typeData}
        casesData={casesData}
        institutionsData={institutionsData}
        policyAreasData={policyAreasData}
        setSubscriptionArray={setSubscriptionArray}
        onClear={onClear}
        onSubmit={onSubmit}
        buttonText="Skrá úr áskrift"
      />
    </SubscriptionsSkeleton>
  )
}
export default UserSubscriptions
