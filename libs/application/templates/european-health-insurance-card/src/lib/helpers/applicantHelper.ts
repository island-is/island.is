import {
  Application,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import { CardResponse, NationalRegistry, NridName } from '../types'

function getObjectKey(obj: any, value: any) {
  return Object.keys(obj).filter((key) => obj[key] === value)
}

export function getFromRegistry(formValues: Application<FormValue>) {
  const nridArr: NridName[] = []
  const userData = formValues.externalData.nationalRegistry
    ?.data as NationalRegistry

  if (userData?.nationalId) {
    nridArr.push({ nrid: userData?.nationalId, name: userData?.fullName })
  }
  const spouseData = formValues?.externalData?.nationalRegistrySpouse
    ?.data as NationalRegistry

  if (spouseData?.nationalId) {
    nridArr.push({ nrid: spouseData?.nationalId, name: spouseData?.name })
  }

  const custodyData = (formValues?.externalData?.childrenCustodyInformation
    ?.data as unknown) as NationalRegistry[]

  if (custodyData) {
    for (let i = 0; i < custodyData.length; i++) {
      nridArr.push({
        nrid: custodyData[i].nationalId,
        name: custodyData[i].fullName,
      })
    }
  }
  return nridArr
}

/** Returns name of person by national registry id by external data from National Registry */
export function getFullName(
  formValues: Application<FormValue>,
  nrid: string | null | undefined,
) {
  if (nrid) {
    const persons = getFromRegistry(formValues)
    return persons.find((x) => x.nrid === nrid)?.name
  }
  return null
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

  for (let i = 0; i < custodyData.data.length; i++) {
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

export function someCanApplyForPlasticOrPdf(
  externalData: ExternalData,
): boolean {
  if (externalData?.cardResponse?.data) {
    const cardResponse = externalData?.cardResponse?.data as CardResponse[]
    for (let i = 0; i < cardResponse?.length; i++) {
      if (cardResponse[i].isInsured && cardResponse[i].canApply) {
        return true
      }

      if (cardResponse[i].isInsured && !cardResponse[i].canApply) {
        const tempCard = cardResponse[i].cards?.find((x) => x.isTemp)
        if (tempCard) {
          continue
        }
        const plasticCard = cardResponse[i].cards?.find((x) => x.isPlastic)
        if (plasticCard) {
          return true
        }
      }
    }
  }
  return false
}

/** Checks if some are insured*/
export function someAreInsured(externalData: ExternalData): boolean {
  if (externalData?.cardResponse?.data) {
    const cardResponse = externalData?.cardResponse?.data as CardResponse[]

    const ret = cardResponse.find((x) => x.isInsured === true)

    if (ret !== null || ret !== undefined) {
      return true
    }
  }
  return false
}

/** Checks if one of all persons from national registry for this user has an health insurance and can apply*/
export function someCanApplyForPlastic(externalData: ExternalData): boolean {
  if (externalData?.cardResponse?.data) {
    const cardResponse = externalData?.cardResponse?.data as CardResponse[]

    const ret = cardResponse.find((x) => x.isInsured && x.canApply)

    if (ret) {
      return true
    }
  }
  return false
}

export function someHavePDF(externalData: ExternalData): boolean {
  if (externalData?.cardResponse?.data) {
    const cardResponse = externalData?.cardResponse?.data as CardResponse[]

    for (let i = 0; i < cardResponse?.length; i++) {
      if (cardResponse[i].isInsured && !cardResponse[i].canApply) {
        const card = cardResponse[i].cards?.find((x) => x.isTemp === true)
        if (card) {
          return true
        }
      }
    }
  }
  return false
}

export function someHavePlasticButNotPdf(externalData: ExternalData): boolean {
  if (externalData?.cardResponse?.data) {
    const cardResponse = externalData?.cardResponse?.data as CardResponse[]

    for (let i = 0; i < cardResponse?.length; i++) {
      if (cardResponse[i].isInsured && !cardResponse[i].canApply) {
        const card = cardResponse[i].cards?.find((x) => x.isPlastic === true)
        if (card) {
          const pdf = cardResponse[i].cards?.find((x) => x.isTemp === true)
          if (!pdf) {
            return true
          }
        }
      }
    }
  }
  return false
}

export function someAreNotInsured(externalData: ExternalData): boolean {
  if (externalData?.cardResponse?.data) {
    const cardResponse = externalData?.cardResponse?.data as CardResponse[]
    const ret = cardResponse.find((x) => !x.isInsured)
    if (ret) {
      return true
    }
  }
  return false
}

export function getEhicResponse(
  application: Application<FormValue>,
): CardResponse[] {
  return application.externalData.cardResponse.data as CardResponse[]
}

/** Get's a array of nationalRegistries for applicants that want to apply for PDF in the first step */
export function getDefaultValuesForPDFApplicants(
  formValues: Application<FormValue>,
) {
  const defaultValues: string[] = []

  const ans = formValues.answers?.addForPDF as Array<any>
  if (ans) {
    ans.forEach((item) => defaultValues.push(item))
  }
  return defaultValues
}

export function hasAPDF(cardInfo: CardResponse) {
  if (cardInfo && cardInfo.cards && cardInfo.cards.length > 0) {
    const card = cardInfo.cards.find((x) => x.isTemp)
    if (card) {
      return true
    }
  }
  return false
}
