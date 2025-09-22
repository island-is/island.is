import {
  ApplicantChildCustodyInformation,
  ExternalData,
  NationalRegistryIndividual,
  Option,
  StaticText,
  NationalRegistrySpouseV3,
  FormValue,
} from '@island.is/application/types'
import { format } from 'kennitala'
import { HealthInsuranceDeclaration } from '../lib/dataSchema'
import { application as m } from '../lib/messages'
import {
  HealthInsuranceContinents,
  HealthInsuranceCountry,
  InsuranceStatementData,
} from '../types'
import { getValueViaPath } from '@island.is/application/core'

export const getChildrenFromExternalData = (externalData: ExternalData) => {
  return (
    (externalData?.childrenCustodyInformation
      ?.data as ApplicantChildCustodyInformation[]) ?? []
  )
}
export const getSpouseFromExternalData = (externalData: ExternalData) => {
  return externalData?.nationalRegistrySpouse?.data as NationalRegistrySpouseV3
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

export const hasFamilySelected = (answers: FormValue) => {
  const spouseBoxChecked = getValueViaPath<Array<string>>(
    answers,
    'selectedApplicants.registerPersonsSpouseCheckboxField',
  )
  const childrenBoxChecked = getValueViaPath<Array<string>>(
    answers,
    'selectedApplicants.registerPersonsChildrenCheckboxField',
  )
  return !!(
    (spouseBoxChecked && spouseBoxChecked.length > 0) ||
    (childrenBoxChecked && childrenBoxChecked.length > 0)
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

export const getApplicantFromExternalData = (
  externalData: ExternalData,
): NationalRegistryIndividual => {
  return externalData.nationalRegistry?.data as NationalRegistryIndividual
}

export const getApplicantAsOption = (externalData: ExternalData): Option[] => {
  const individual = getApplicantFromExternalData(externalData)
  return [
    {
      value: individual?.nationalId,
      label: individual?.fullName,
      subLabel: `${format(individual?.nationalId)}`,
    },
  ]
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

export const getSelectedApplicants = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const applicant = getApplicantFromExternalData(externalData)
  const spouse = getSpouseFromExternalData(externalData)
  const children = getChildrenFromExternalData(externalData)
  let selectedApplicants: StaticText[][] = []

  const personsBoxChecked = getValueViaPath<Array<string>>(
    answers,
    'selectedApplicants.registerPersonsApplicantCheckboxField',
  )

  selectedApplicants = selectedApplicants.concat(
    personsBoxChecked
      ? personsBoxChecked.map((a) => {
          if (a === applicant.nationalId) {
            return [
              applicant.fullName,
              applicant.nationalId,
              m.overview.familyTableRelationApplicantText,
            ]
          } else return []
        })
      : [],
  )

  const spouseBoxChecked = getValueViaPath<Array<string>>(
    answers,
    'selectedApplicants.registerPersonsSpouseCheckboxField',
  )

  if (spouse) {
    selectedApplicants = selectedApplicants.concat(
      spouseBoxChecked
        ? spouseBoxChecked.map((s) => {
            if (s === spouse.nationalId) {
              return [
                spouse.name,
                spouse.nationalId,
                m.overview.familyTableRelationSpouseText,
              ]
            } else return []
          })
        : [],
    )
  }

  const childrenBoxChecked = getValueViaPath<Array<string>>(
    answers,
    'selectedApplicants.registerPersonsChildrenCheckboxField',
  )

  const selectedChildren = childrenBoxChecked?.map((childNationalId) => {
    const childData = children.find((c) => c.nationalId === childNationalId)
    return [
      childData ? childData.fullName : '',
      childData ? childData.nationalId : '',
      m.overview.familyTableRelationChildText,
    ]
  })
  if (selectedChildren) {
    selectedApplicants = selectedApplicants.concat(selectedChildren)
  }
  return selectedApplicants
}

export const getInsuranceStatementDataFromExternalData = (
  externalData: ExternalData,
): InsuranceStatementData => {
  return externalData.insuranceStatementData?.data as InsuranceStatementData
}
