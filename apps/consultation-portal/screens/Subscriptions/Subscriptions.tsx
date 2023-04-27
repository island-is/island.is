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
  SortTitle,
  SubscriptionArray,
  TypeForSubscriptions,
} from '../../types/interfaces'
import { useSearchSubscriptions, useUser } from '../../utils/helpers'
import getInitValues from './getInitValues'
import TabsList from './tabsList'
import usePostSubscription from '../../utils/helpers/api/usePostSubscription'
import SubscriptionsSkeleton from '../../components/SubscriptionsSkeleton/SubscriptionsSkeleton'
import ChosenSubscriptions from '../../components/ChosenSubscriptions/ChosenSubscriptions'

interface SubProps {
  cases: CaseForSubscriptions[]
  types: ArrOfTypesForSubscriptions
}

const SubscriptionsScreen = ({ cases, types }: SubProps) => {
  const { isAuthenticated, userLoading } = useUser()
  const [currentTab, setCurrentTab] = useState<Area>(Area.case)
  const { Institutions, PolicyAreas } = getInitValues({ types: types })
  const [casesData, setCasesData] = useState<Array<CaseForSubscriptions>>(cases)
  const [institutionsData, setInstitutionsData] = useState(Institutions)
  const [policyAreasData, setPolicyAreasData] = useState(PolicyAreas)
  const [typeData, setTypeData] = useState<Array<TypeForSubscriptions>>(
    GeneralSubscriptionArray,
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

  const { postSubsMutation, postLoading } = usePostSubscription()

  const { searchIsLoading } = useSearchSubscriptions({
    searchValue: searchValue,
    initCasesData: cases,
    sortTitle: sortTitle,
    initInstitutions: Institutions,
    initPolicyAreas: PolicyAreas,
    setCasesData: setCasesData,
    setInstitutionsData: setInstitutionsData,
    setPolicyAreasData: setPolicyAreasData,
  })

  const { caseIds, institutionIds, policyAreaIds } = subscriptionArray

  const onSubmit = async () => {
    // setSubscriptionArray(SubscriptionsArray)
    // //TODO: subscribe to all
    // const objToSend = {
    //   // subscribeToAll: generalSubscription.length > 0,
    //   // subscribeToAllType: generalSubscription,
    //   caseIds: caseIds,
    //   institutionIds: institutionIds,
    //   policyAreaIds: policyAreaIds,
    // }
    // const posting = await postSubsMutation({
    //   variables: {
    //     input: objToSend,
    //   },
    // })
    //   .then((res) => {
    //     toast.success('Áskrift skráð')
    //   })
    //   .catch((e) => {
    //     console.error(e)
    //     toast.error('Eitthvað fór úrskeiðis')
    //   })
  }

  const onClear = () => {
    // setSubscriptionArray(SubscriptionsArray)
  }

  const tabs = TabsList({
    casesData: casesData,
    setCasesData: (arr: Array<CaseForSubscriptions>) => setCasesData(arr),
    institutionsData: institutionsData,
    generalSubArray: GeneralSubscriptionArray,
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
    <SubscriptionsSkeleton
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      tabs={tabs}
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
        buttonText="Skrá í áskrift"
      />
    </SubscriptionsSkeleton>
  )
}

export default SubscriptionsScreen
