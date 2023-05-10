import TabsList from '../../../screens/Subscriptions/tabsList'
import { Area, SortOptions } from '../../../types/enums'
import {
  ArrOfTypesForSubscriptions,
  CaseForSubscriptions,
  SortTitle,
  SubscriptionArray,
} from '../../../types/interfaces'
import getInitValues from './getInitValues'
import initSubscriptions from './initSubscriptions'
import { useState } from 'react'

interface Props {
  types: ArrOfTypesForSubscriptions
  cases: CaseForSubscriptions[]
  dontShowNew?: boolean
  dontShowChanges?: boolean
  isMySubscriptions?: boolean
}

const useSubscriptions = ({
  types,
  cases,
  dontShowNew,
  dontShowChanges,
  isMySubscriptions,
}: Props) => {
  const { Institutions, PolicyAreas } = getInitValues({ types: types })
  const initSubs = initSubscriptions({
    casesData: cases,
    institutionsData: Institutions,
    policyAreasData: PolicyAreas,
  })
  const [subscriptionArray, setSubscriptionArray] = useState<SubscriptionArray>(
    initSubs,
  )

  const [sortTitle, setSortTitle] = useState<SortTitle>({
    Mál: SortOptions.latest,
    Stofnanir: SortOptions.aToZ,
    Málefnasvið: SortOptions.aToZ,
  })

  const [searchValue, setSearchValue] = useState('')

  const tabs = TabsList({
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
    dontShowNew: dontShowNew,
    dontShowChanges: dontShowChanges,
    isMySubscriptions: isMySubscriptions,
  })

  return {
    initSubs,
    subscriptionArray,
    setSubscriptionArray,
    sortTitle,
    setSortTitle,
    searchValue,
    setSearchValue,
    tabs,
  }
}

export default useSubscriptions
