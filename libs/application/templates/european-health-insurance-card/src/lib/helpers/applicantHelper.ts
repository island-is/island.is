import {
  Application,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import {
  CardResponse,
  NationalRegistry,
  NridName,
  NationalRegistrySpouse,
  Answer,
} from '../types'

function getObjectKey(obj: FormValue, value: string | boolean) {
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
    ?.data as NationalRegistrySpouse

  if (spouseData?.nationalId) {
    nridArr.push({ nrid: spouseData?.nationalId, name: spouseData?.name })
  }

  const custodyData = formValues?.externalData?.childrenCustodyInformation
    ?.data as NationalRegistry[]

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

export function getPlasticExpiryDate(resp: CardResponse): Date | undefined {
  try {
    const obj = resp.cards?.find((x) => x.isPlastic)
    if (obj && obj.expiryDate) {
      return new Date(obj.expiryDate as Date)
    } else {
      return undefined
    }
  } catch {
    return undefined
  }
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

  const custodyData = formValues?.externalData?.childrenCustodyInformation
    ?.data as NationalRegistry[]

  for (let i = 0; i < custodyData.length; i++) {
    if (custodyData[i].nationalId) {
      nridArr.push(custodyData[i].nationalId)
    }
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

  for (let i = 0; i < custodyData.length; i++) {
    if (applicants.includes(`${cardType}-${custodyData[i].nationalId}`)) {
      applying.push(custodyData[i].nationalId)
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
    return cardResponse.some((x) => x.canApply || x.canApplyForPDF)
  }
  return false
}

/** Checks if some are insured*/
export function someAreInsured(externalData: ExternalData): boolean {
  if (externalData?.cardResponse?.data) {
    const cardResponse = externalData?.cardResponse?.data as CardResponse[]
    return cardResponse.some((x) => x.isInsured)
  }
  return false
}

/** Checks if one of all persons from national registry for this user has an health insurance and can apply*/
export function someCanApplyForPlastic(externalData: ExternalData): boolean {
  if (externalData?.cardResponse?.data) {
    const cardResponse = externalData?.cardResponse?.data as CardResponse[]
    return cardResponse.some((x) => x.isInsured && x.canApply)
  }
  return false
}

export function someHavePDF(externalData: ExternalData): boolean {
  if (externalData?.cardResponse?.data) {
    const cardResponse = externalData?.cardResponse?.data as CardResponse[]
    return cardResponse.some(
      (x) => x.isInsured && !x.canApplyForPDF && x.cards?.some((y) => y.isTemp),
    )
  }
  return false
}

export function someHavePlasticButNotPdf(externalData: ExternalData): boolean {
  if (externalData?.cardResponse?.data) {
    const cardResponse = externalData?.cardResponse?.data as CardResponse[]
    return cardResponse.some((x) => x.canApplyForPDF)
  }
  return false
}

export function someAreNotInsured(externalData: ExternalData): boolean {
  if (externalData?.cardResponse?.data) {
    const cardResponse = externalData?.cardResponse?.data as CardResponse[]
    return cardResponse.some((x) => !x.isInsured)
  }
  return false
}

// In some instances, users can be insured but cannot apply although a user doesn't have a valid card issued
export function someAreInsuredButCannotApply(
  externalData: ExternalData,
): boolean {
  if (externalData?.cardResponse?.data) {
    const cardResponse = externalData?.cardResponse?.data as CardResponse[]
    return cardResponse.some(
      (x) =>
        x.isInsured &&
        !x.canApply &&
        !x.canApplyForPDF &&
        !hasAPDF(x) &&
        !hasPlastic(x),
    )
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

  const answers = formValues.answers as unknown as Answer
  const ans = answers.delimitations.addForPDF

  if (ans) {
    ans.forEach((item) => defaultValues.push(item))
  }
  return defaultValues
}

export function hasAPDF(cardInfo: CardResponse) {
  if (cardInfo && cardInfo.cards && cardInfo.cards.length > 0) {
    return cardInfo.cards.some((x) => x.isTemp)
  }
  return false
}

export function hasPlastic(cardInfo: CardResponse) {
  if (cardInfo && cardInfo.cards && cardInfo.cards.length > 0) {
    return cardInfo.cards.some((x) => x.isPlastic)
  }
  return false
}
