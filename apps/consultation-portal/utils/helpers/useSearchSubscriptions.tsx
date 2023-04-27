import { useEffect, useState } from 'react'
import sorting from './sorting'
import { Area } from '@island.is/consultation-portal/types/enums'
import {
  ArrOfIdAndName,
  CaseForSubscriptions,
  SortTitle,
} from '@island.is/consultation-portal/types/interfaces'

interface Props {
  searchValue: string
  initCasesData: Array<CaseForSubscriptions>
  sortTitle: SortTitle
  initInstitutions: Array<ArrOfIdAndName>
  initPolicyAreas: Array<ArrOfIdAndName>
  setCasesData: (cases: Array<CaseForSubscriptions>) => void
  setInstitutionsData: (institutions: Array<ArrOfIdAndName>) => void
  setPolicyAreasData: (policyAreas: Array<ArrOfIdAndName>) => void
}

export const useSearchSubscriptions = ({
  searchValue,
  initCasesData,
  sortTitle,
  initInstitutions,
  initPolicyAreas,
  setCasesData,
  setInstitutionsData,
  setPolicyAreasData,
}: Props) => {
  const [searchIsLoading, setSearchIsLoading] = useState(false)

  useEffect(() => {
    setSearchIsLoading(true)

    const sortedCases = sorting(
      initCasesData,
      sortTitle[Area.case],
    ) as Array<CaseForSubscriptions>

    const sortedInstitutions = sorting(
      initInstitutions,
      sortTitle[Area.institution],
    ) as Array<ArrOfIdAndName>

    const sortedPolicyAreas = sorting(
      initPolicyAreas,
      sortTitle[Area.policyArea],
    ) as Array<ArrOfIdAndName>

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

      setCasesData(sortedCasesFiltered)
      setInstitutionsData(sortedInstitutionsFiltered)
      setPolicyAreasData(sortedPolicyAreasFiltered)
    } else {
      setCasesData(sortedCases)
      setInstitutionsData(sortedInstitutions)
      setPolicyAreasData(sortedPolicyAreas)
    }

    setSearchIsLoading(false)
  }, [searchValue])

  return { searchIsLoading }
}

export default useSearchSubscriptions
