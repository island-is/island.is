import {
  ApplicantsInfo,
  PropertyUnit,
} from '@island.is/application/templates/hms/rental-agreement'
import { SecurityDepositType } from '@island.is/clients/hms-rental-agreement'

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
  values: [number]
}

interface ApiResponse {
  data: ApiDataItem[]
}

export interface FinancialIndexationEntry {
  month: Date
  value: number
}

export const listOfLastMonths = (numberOfMonths: number) => {
  const months: string[] = []
  const now = new Date()
  // Start from next month
  let year = now.getFullYear()
  let month = now.getMonth() + 2 // JS months are 0-based, so +1 for current, +1 for next

  if (month > 12) {
    month = 1
    year += 1
  }

  for (let i = 0; i < numberOfMonths; i++) {
    // Pad month with zero
    const mm = month < 10 ? `0${month}` : `${month}`
    months.push(`${year}M${mm}`)

    // Move to previous month
    month--
    if (month === 0) {
      month = 12
      year--
    }
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

export const fetchFinancialIndexationForMonths = async (months: string[]) => {
  const url =
    'https://px.hagstofa.is:443/pxis/api/v1/is/Efnahagur/visitolur/1_vnv/1_vnv/VIS01004.px'

  const payload = {
    query: [
      {
        code: 'Mánuður',
        selection: {
          filter: 'item',
          values: months,
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

  const response = await fetch(url, {
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
      value: item.values[0],
    }),
  )
}
