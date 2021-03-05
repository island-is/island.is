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
    phoneNumber: answers.phoneNumber as string,
    email: answers.email as string,
    address: nationalRegistryData.address?.streetAddress as string,
    postalCode: nationalRegistryData.address?.postalCode as string,
    city: nationalRegistryData.address?.city as string,
  }
}

export function variablesForResidenceChange(
  answers: FormValue,
  externalData: FormValue,
) {
  const parentBNationalRegistry = externalData.parentNationalRegistry as FormValue
  const childrenNationalRegistry = externalData.childrenNationalRegistry as FormValue
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
