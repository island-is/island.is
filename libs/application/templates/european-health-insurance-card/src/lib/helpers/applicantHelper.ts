import {
  FormValue,
  Application,
  ExternalData,
} from '@island.is/application/types'
import { CardResponse, NationalRegistry, NridName } from '../types'

function getObjectKey(obj: any, value: any) {
  return Object.keys(obj).filter((key) => obj[key] === value)
}

export function getFromRegistry(formValues: Application<FormValue>) {
  const nridArr: NridName[] = []
  console.log(formValues.externalData, 'formValues.externalData')
  const userData = formValues.externalData.nationalRegistry
    ?.data as NationalRegistry

  console.log(userData, 'userData')
  if (userData?.nationalId) {
    nridArr.push({ nrid: userData?.nationalId, name: userData?.fullName })
  }
  const spouseData = formValues?.externalData?.nationalRegistrySpouse
    ?.data as NationalRegistry

  if (spouseData?.nationalId) {
    console.log(spouseData, 'spouseData')
    nridArr.push({ nrid: spouseData?.nationalId, name: spouseData?.name })
  }

  const custodyData = (formValues?.externalData?.childrenCustodyInformation
    ?.data as unknown) as NationalRegistry[]

  if (custodyData) {
    for (let i = 0; i < custodyData.length; i++) {
      console.log(custodyData, 'custodyData')
      nridArr.push({
        nrid: custodyData[i].nationalId,
        name: custodyData[i].fullName,
      })
    }
  }

  console.log(nridArr, 'nridArr')

  return nridArr
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

export function base64ToArrayBuffer(base64Pdf: string) {
  const binaryString = window.atob(base64Pdf)
  const binaryLen = binaryString.length
  const bytes = new Uint8Array(binaryLen)
  for (let i = 0; i < binaryLen; i++) {
    const ascii = binaryString.charCodeAt(i)
    bytes[i] = ascii
  }
  return bytes
}

export function hasInsurance(externalData: ExternalData): boolean {
  console.log(externalData)
  if (externalData?.cardResponse?.data) {
    const cardResponse = externalData?.cardResponse?.data as CardResponse[]

    for (let i = 0; i < cardResponse.length; i++) {
      if (cardResponse[i].isInsured) {
        return true
      }
    }
  }
  return false
}
