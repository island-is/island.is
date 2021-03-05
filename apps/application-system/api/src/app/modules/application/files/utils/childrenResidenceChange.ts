import { FormValue } from '@island.is/application/core'
import { PersonResidenceChange } from '@island.is/application/templates/children-residence-change'
import { User } from '@island.is/api/domains/national-registry'

export function applicantData(answers: FormValue, externalData: FormValue) {
  const nationalRegistry = externalData.nationalRegistry as FormValue
  const nationalRegistryData = (nationalRegistry.data as unknown) as User

  return {
    id: nationalRegistryData.nationalId,
    name: nationalRegistryData.fullName,
    ssn: nationalRegistryData.nationalId,
    email: answers.parentAEmail as string,
    phoneNumber: answers.parentAPhoneNumber as string,
    address: nationalRegistryData.address?.streetAddress as string,
    postalCode: nationalRegistryData.address?.postalCode as string,
    city: nationalRegistryData.address?.city as string,
  }
}

export const dataToUse = ({
  answers,
  externalData,
  key,
}: {
  answers: FormValue
  externalData: FormValue
  key: string
}): FormValue => {
  const mockData = (answers.mockData as FormValue)?.[key] as FormValue
  const data = externalData[key] as FormValue
  if (answers.useMocks === 'no') {
    return data
  }
  return mockData || data
}

export function variablesForResidenceChange(
  answers: FormValue,
  externalData: FormValue,
) {
  const parentBNationalRegistry = dataToUse({
    answers,
    externalData,
    key: 'parentNationalRegistry',
  })
  const childrenNationalRegistry = dataToUse({
    answers,
    externalData,
    key: 'childrenNationalRegistry',
  })
  const selectedChildrenNames = (answers.selectChild as unknown) as Array<
    string
  >
  const allChildren = (childrenNationalRegistry.data as unknown) as Array<
    PersonResidenceChange
  >

  const parentA = applicantData(answers, externalData) as PersonResidenceChange
  const parentB = (parentBNationalRegistry.data as unknown) as PersonResidenceChange
  const childrenAppliedFor = allChildren.filter((c) =>
    selectedChildrenNames.includes(c.name),
  )
  const expiry = answers.selectDuration as Array<string>
  const reason = answers.residenceChangeReason as string

  return { parentA, parentB, childrenAppliedFor, expiry, reason }
}
