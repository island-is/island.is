import { useEffect, useState } from 'react'
import sorting from '../utils/helpers/sorting'
import { Area } from '../types/enums'
import {
  CasesSubscriptionData,
  InstitutionsSubscriptionData,
  PolicyAreasSubscriptionData,
  SortTitle,
  SubscriptionArray,
} from '../types/interfaces'

interface Props {
  searchValue: string
  sortTitle: SortTitle
  subscriptionArray: SubscriptionArray
  setSubscriptionArray: (_: SubscriptionArray) => void
  initSubs: SubscriptionArray
}

export const useSearchSubscriptions = ({
  searchValue,
  sortTitle,
  subscriptionArray,
  setSubscriptionArray,
  initSubs,
}: Props) => {
  const [searchIsLoading, setSearchIsLoading] = useState(false)

  const { subscribedToAllNewObj, subscribedToAllChangesObj } = subscriptionArray
  const {
    cases: initCases,
    institutions: initInstitutions,
    policyAreas: initPolicyAreas,
  } = initSubs

  useEffect(() => {
    setSearchIsLoading(true)

    const sortedCases = sorting(
      initCases,
      sortTitle[Area.case],
    ) as Array<CasesSubscriptionData>

    const sortedInstitutions = sorting(
      initInstitutions,
      sortTitle[Area.institution],
    ) as Array<InstitutionsSubscriptionData>

    const sortedPolicyAreas = sorting(
      initPolicyAreas,
      sortTitle[Area.policyArea],
    ) as Array<PolicyAreasSubscriptionData>

    if (searchValue) {
      const lowerCaseSearchValue = searchValue.toLocaleLowerCase()

      const sortedCasesFiltered = sortedCases.filter(
        (item) =>
          item.name.toLocaleLowerCase().includes(lowerCaseSearchValue) ||
          item.caseNumber.toLocaleLowerCase().includes(lowerCaseSearchValue) ||
          item.institutionName
            .toLocaleLowerCase()
            .includes(lowerCaseSearchValue) ||
          item.policyAreaName
            .toLocaleLowerCase()
            .includes(lowerCaseSearchValue),
      )

      const sortedInstitutionsFiltered = sortedInstitutions.filter((item) =>
        item.name.toLocaleLowerCase().includes(lowerCaseSearchValue),
      )

      const sortedPolicyAreasFiltered = sortedPolicyAreas.filter((item) =>
        item.name.toLocaleLowerCase().includes(lowerCaseSearchValue),
      )

      const newObj = {
        cases: sortedCasesFiltered,
        institutions: sortedInstitutionsFiltered,
        policyAreas: sortedPolicyAreasFiltered,
        subscribedToAllNewObj: subscribedToAllNewObj,
        subscribedToAllChangesObj: subscribedToAllChangesObj,
      }
      setSubscriptionArray(newObj)
    } else {
      const newObj = {
        cases: sortedCases,
        institutions: sortedInstitutions,
        policyAreas: sortedPolicyAreas,
        subscribedToAllNewObj: subscribedToAllNewObj,
        subscribedToAllChangesObj: subscribedToAllChangesObj,
      }
      setSubscriptionArray(newObj)
    }

    setSearchIsLoading(false)
  }, [searchValue])

  return { searchIsLoading }
}

export default useSearchSubscriptions
