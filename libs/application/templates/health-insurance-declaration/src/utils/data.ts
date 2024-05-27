import {
  ApplicantChildCustodyInformation,
  ExternalData,
  NationalRegistryIndividual,
  Option,
  StaticText,
  NationalRegistrySpouse,
} from '@island.is/application/types'
import { format } from 'kennitala'
import { HealthInsuranceDeclaration } from '../lib/dataSchema'
import { application as m } from '../lib/messages'
import {
  HealthInsuranceContinents,
  HealthInsuranceCountry,
  InsuranceStatementData,
} from '../types'

export const getChildrenFromExternalData = (externalData: ExternalData) => {
  return (
    (externalData?.childrenCustodyInformation
      ?.data as ApplicantChildCustodyInformation[]) ?? []
  )
}
export const getSpouseFromExternalData = (externalData: ExternalData) => {
  return externalData?.nationalRegistrySpouse?.data as NationalRegistrySpouse
}

export const getInsuranceStatus = (externalData: ExternalData) => {
  return getInsuranceStatementDataFromExternalData(externalData)?.canApply
}

export const getCountriesFromExternalData = (
  externalData: ExternalData,
): HealthInsuranceCountry[] => {
  return getInsuranceStatementDataFromExternalData(externalData)?.countries
}

export const getCountriesAsOption = (externalData: ExternalData): Option[] => {
  const countries = getCountriesFromExternalData(externalData)
  if (countries && countries.length) {
    return countries.map((country) => {
      return {
        value: country.code,
        label: country.icelandicName,
      }
    })
  }
  return []
}
export const getCountryNameFromCode = (
  code: string,
  externalData: ExternalData,
): string => {
  const countries = getCountriesFromExternalData(externalData)
  const country = countries.find((c) => c.code === code)
  if (country) {
    return country.icelandicName ?? country.name
  }
  return ''
}

export const hasFamilyAvailable = (answers: HealthInsuranceDeclaration) => {
  return answers.hasSpouse || answers.hasChildren
}

export const hasFamilySelected = (answers: HealthInsuranceDeclaration) => {
  return (
    answers.registerPersonsSpouseCheckboxField?.length > 0 ||
    answers.registerPersonsChildrenCheckboxField?.length > 0
  )
}

export const getContinentNameFromCode = (
  code: string,
  externalData: ExternalData,
): string => {
  const continents = getContinentsFromExternalData(externalData)
  const continent = continents.find((c) => c.code === code)
  if (continent) {
    return continent.icelandicName
  }
  return ''
}

export const getContinentsFromExternalData = (
  externalData: ExternalData,
): HealthInsuranceContinents[] => {
  return (
    getInsuranceStatementDataFromExternalData(externalData)?.continents ?? []
  )
}

export const getCommentFromExternalData = (
  externalData: ExternalData,
): string => {
  return getInsuranceStatementDataFromExternalData(externalData).comment ?? ''
}

export const getContinentsAsOption = (externalData: ExternalData): Option[] => {
  const continents = getContinentsFromExternalData(externalData)
  if (continents && continents.length) {
    return continents.map((continent) => {
      return {
        value: continent.code,
        label: continent.icelandicName,
      }
    })
  }
  return []
}

export const getFullNameFromExternalData = (externalData: ExternalData) => {
  return (
    (externalData.nationalRegistry?.data as NationalRegistryIndividual)
      ?.fullName ?? ''
  )
}
export const getChildrenAsOptions = (externalData: ExternalData): Option[] => {
  const children = getChildrenFromExternalData(externalData)

  if (children && children.length) {
    return children.map((child) => {
      return {
        value: child.nationalId,
        label: child.fullName,
        subLabel: `${format(child.nationalId)}`,
      }
    })
  }
  return []
}

export const getSpouseAsOptions = (externalData: ExternalData): Option[] => {
  const spouse = getSpouseFromExternalData(externalData)

  if (spouse) {
    return [
      {
        value: spouse.nationalId,
        label: spouse.name,
        subLabel: `${format(spouse.nationalId)}`,
      },
    ]
  }

  return []
}

export const getSelectedFamily = (
  answers: HealthInsuranceDeclaration,
  externalData: ExternalData,
) => {
  const spouse = getSpouseFromExternalData(externalData)
  const children = getChildrenFromExternalData(externalData)
  let selectedFamily: StaticText[][] = []

  if (spouse) {
    selectedFamily = selectedFamily.concat(
      answers.registerPersonsSpouseCheckboxField?.map((s) => {
        if (s === spouse.nationalId) {
          return [
            spouse.name,
            spouse.nationalId,
            m.overview.familyTableRelationSpouseText,
          ]
        } else return []
      }),
    )
  }

  const selectedChildren = answers.registerPersonsChildrenCheckboxField?.map(
    (childNationalId) => {
      const childData = children.find((c) => c.nationalId === childNationalId)
      return [
        childData ? childData.fullName : '',
        childData ? childData.nationalId : '',
        m.overview.familyTableRelationChildText,
      ]
    },
  )

  if (selectedChildren) {
    selectedFamily.concat(selectedChildren)
  }
  return selectedFamily
}

export const getInsuranceStatementDataFromExternalData = (
  externalData: ExternalData,
): InsuranceStatementData => {
  return externalData.insuranceStatementData?.data as InsuranceStatementData
}
