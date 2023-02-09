import { FormValue, Application } from '@island.is/application/types'
import { NationalRegistry } from '../types'

function getObjectKey(obj: any, value: any) {
  return Object.keys(obj).filter((key) => obj[key] === value)
}

export function getEhicApplicants(
  formValues: Application<FormValue>,
  cardType: string | null,
) {
  const nridArr: string[] = []
  const userData = formValues.externalData.nationalRegistry
    ?.data as NationalRegistry
  if (userData?.nationalId) {
    nridArr.push(userData?.nationalId)
  }
  const spouseData = formValues?.externalData?.nationalRegistrySpouse
    ?.data as NationalRegistry

  if (spouseData?.nationalId) {
    nridArr.push(spouseData?.nationalId)
  }

  const custodyData = (formValues?.externalData
    ?.childrenCustodyInformation as unknown) as NationalRegistry

  if (custodyData?.nationalId) {
    nridArr.push(custodyData?.nationalId)
  }

  if (!cardType) {
    return nridArr
  }

  const applicants = getObjectKey(formValues.answers, true)
  const applying: string[] = []

  if (applicants.includes(`${cardType}-${userData?.nationalId}`)) {
    applying.push(userData?.nationalId)
  }

  if (applicants.includes(`${cardType}-${spouseData?.nationalId}`)) {
    applying.push(spouseData?.nationalId)
  }

  for (var i = 0; i < custodyData.data.length; i++) {
    if (applicants.includes(`${cardType}-${custodyData.data[i].nationalId}`)) {
      applying.push(custodyData.data[i])
    }
  }

  return applying
}
