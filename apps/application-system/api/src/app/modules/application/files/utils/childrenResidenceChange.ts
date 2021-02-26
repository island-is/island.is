import { FormValue } from '@island.is/application/core'
import {
  ParentResidenceChange,
  PersonResidenceChange,
} from '@island.is/application/templates/children-residence-change'
import { User } from '@island.is/api/domains/national-registry'

export function applicantData(
  answers: FormValue,
  externalData: FormValue,
): ParentResidenceChange {
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
  const childrenAppliedFor = (answers.selectChild as unknown) as Array<
    PersonResidenceChange
  >
  const parentB = (parentBNationalRegistry.data as unknown) as ParentResidenceChange

  parentB.email = answers.parentBEmail as string
  parentB.phoneNumber = answers.parentBPhoneNumber as string

  const parentA = applicantData(answers, externalData)

  const expiry = answers.expiry as string

  return { parentA, parentB, childrenAppliedFor, expiry }
}
