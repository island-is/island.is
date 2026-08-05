import {
  ApplicantsInfo,
  PropertyUnit,
} from '@island.is/application/templates/hms/rental-agreement'
import { SecurityDepositType } from '@island.is/clients/hms-rental-agreement'
import { TemplateApiError } from '@island.is/nest/problem'
import { messages } from '@island.is/application/templates/hms/rental-agreement'

export const parseToNumber = (value: string): number => {
  const normalizedValue = value.replace(',', '.')
  const parsed = parseFloat(normalizedValue)
  return isNaN(parsed) ? 0 : parsed
}

export const formatPhoneNumber = (phone: string) => {
  return phone
    .trim()
    .replace(/(^00354|^\+354)/g, '') // Remove country code
    .replace(/\D/g, '') // Remove all non-digits
}

export const mapApplicantsInfo = (applicants: Array<ApplicantsInfo> = []) => {
  return applicants.map((applicant) => ({
    name: applicant.nationalIdWithName.name,
  }))
}

export const mapPersonToArray = (person: ApplicantsInfo) => {
  return {
    nationalId: person.nationalIdWithName.nationalId,
    name: person.nationalIdWithName.name,
    email: person.email,
    address: person.address,
    phone: formatPhoneNumber(person.phone),
    isRepresentative: person.isRepresentative,
  }
}

export const getPropertyId = (units: PropertyUnit[] | undefined) => {
  return units && units.length > 0 ? units[0].propertyCode ?? null : null
}

export const mapAppraisalUnits = (units: PropertyUnit[] | undefined) => {
  return units?.map((unit) => {
    const propertySize =
      unit.changedSize && unit.changedSize >= 3 ? unit.changedSize : unit.size
    const apartmentFloor =
      unit.unitCode && parseInt(unit.unitCode.substring(2, 4), 10).toString()
    const apartmentNumber =
      unit.unitCode && parseInt(unit.unitCode.slice(-2), 10).toString()

    return {
      appraisalUnitId: unit.appraisalUnitCode?.toString() ?? null,
      apartmentNumber: apartmentNumber ?? null,
      floor: apartmentFloor ?? null,
      size:
        propertySize !== undefined && propertySize !== null ? propertySize : 0,
      rooms:
        unit.numOfRooms !== undefined && unit.numOfRooms !== null
          ? unit.numOfRooms
          : 0,
    }
  })
}

export const getSecurityDepositTypeDescription = (
  type: string | undefined,
  bankGuaranteeInfo: string | undefined,
  thirdPartyGuaranteeInfo: string | undefined,
  insuranceCompanyInfo: string | undefined,
  mutualFundInfo: string | undefined,
) => {
  if (
    type === SecurityDepositType.Capital ||
    type === SecurityDepositType.Other ||
    type === undefined
  ) {
    return null
  }

  switch (type) {
    case SecurityDepositType.BankGuarantee:
      return bankGuaranteeInfo
    case SecurityDepositType.ThirdPartyGuarantee:
      return thirdPartyGuaranteeInfo
    case SecurityDepositType.InsuranceCompany:
      return insuranceCompanyInfo
    case SecurityDepositType.LandlordMutualFund:
      return mutualFundInfo
    default:
      return null
  }
}

// Utils for getting index from Hagstofan
interface ApiDataItem {
  key: [string, 'financial_indexation']
  values: [number | string]
}

interface ApiResponse {
  data: ApiDataItem[]
}

interface ApiMetadataResponse {
  variables: Array<{
    code: string
    values: string[]
  }>
}

export interface FinancialIndexationEntry {
  month: Date
  value: string
}

const FINANCIAL_INDEXATION_URL =
  'https://px.hagstofa.is:443/pxis/api/v1/is/Efnahagur/visitolur/1_vnv/1_vnv/VIS01004.px'
const FINANCIAL_INDEXATION_FETCH_TIMEOUT = 10000

export const listOfLastMonths = (
  numberOfMonths: number,
  currentDate = new Date(),
) => {
  const months: string[] = []
  const firstMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 2,
    1,
  )

  for (let i = 0; i < numberOfMonths; i++) {
    const date = new Date(
      firstMonth.getFullYear(),
      firstMonth.getMonth() - i,
      1,
    )
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const mm = month < 10 ? `0${month}` : `${month}`
    months.push(`${year}M${mm}`)
  }

  return months
}

const parsePXMonth = (monthStr: string): Date => {
  // Expects format: "YYYYMmm" (e.g. "2025M06")
  const match = /^(\d{4})M(\d{2})$/.exec(monthStr)
  if (!match) throw new Error('Invalid month format: ' + monthStr)
  const year = parseInt(match[1], 10)
  const month = parseInt(match[2], 10) - 1 // JS Date months are 0-based
  return new Date(year, month, 1)
}

const isAbortError = (error: unknown): error is Error => {
  return error instanceof Error && error.name === 'AbortError'
}

const fetchFinancialIndexation = async (
  init?: RequestInit,
): Promise<Response> => {
  const controller = new AbortController()
  const timeout = setTimeout(() => {
    controller.abort()
  }, FINANCIAL_INDEXATION_FETCH_TIMEOUT)

  try {
    return await fetch(FINANCIAL_INDEXATION_URL, {
      ...init,
      signal: controller.signal,
    })
  } catch (error) {
    if (isAbortError(error)) {
      throw new Error(
        `Hagstofa request timed out after ${FINANCIAL_INDEXATION_FETCH_TIMEOUT}ms`,
      )
    }

    throw error
  } finally {
    clearTimeout(timeout)
  }
}

const fetchAvailableFinancialIndexationMonths = async () => {
  const response = await fetchFinancialIndexation()

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const json: ApiMetadataResponse = await response.json()
  const monthVariable = json.variables.find(({ code }) => code === 'Mánuður')

  if (!monthVariable) {
    throw new Error('Missing Mánuður variable in Hagstofa metadata response')
  }

  return new Set(monthVariable.values)
}

export const fetchFinancialIndexationForMonths = async (months: string[]) => {
  const availableMonths = await fetchAvailableFinancialIndexationMonths()
  const publishedMonths = months.filter((month) => availableMonths.has(month))

  if (publishedMonths.length === 0) {
    return []
  }

  const payload = {
    query: [
      {
        code: 'Mánuður',
        selection: {
          filter: 'item',
          values: publishedMonths,
        },
      },
      {
        code: 'Vísitala',
        selection: {
          filter: 'item',
          values: ['financial_indexation'],
        },
      },
    ],
    response: {
      format: 'json',
    },
  }

  const response = await fetchFinancialIndexation({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const json: ApiResponse = await response.json()

  return json.data.map(
    (item): FinancialIndexationEntry => ({
      month: parsePXMonth(item.key[0]),
      value: String(item.values[0]),
    }),
  )
}

export const errorMapper = (error: {
  body: { errorCode: string; details: { phoneNumbers?: string[] } }
}) => {
  try {
    const body = error.body
    switch (body.errorCode) {
      case '40001_mobile_signature_capabilities_missing':
        return new TemplateApiError(
          {
            title: messages.errorMessages.mobileSignatureRequired,
            summary: {
              ...messages.errorMessages.mobileSignatureRequiredSummary,
              values: {
                phoneNumbers: body.details.phoneNumbers?.join(', ') ?? '',
              },
            },
          },
          400,
        )
      default:
        return new TemplateApiError(
          {
            title: messages.errorMessages.defaultErrorTitle,
            summary: messages.errorMessages.defaultErrorSummary,
          },
          400,
        )
    }
  } catch (error) {
    return new TemplateApiError(
      {
        title: messages.errorMessages.defaultErrorTitle,
        summary: messages.errorMessages.defaultErrorSummary,
      },
      400,
    )
  }
}
