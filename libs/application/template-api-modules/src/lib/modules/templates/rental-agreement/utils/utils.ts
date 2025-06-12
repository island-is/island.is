import {
  ApplicantsInfo,
  PropertyUnit,
} from '@island.is/application/templates/rental-agreement'
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

export const filterNonRepresentativesAndMapInfo = (
  applicants: Array<ApplicantsInfo> = [],
) => {
  return applicants
    .filter(
      ({ isRepresentative }) => !isRepresentative?.includes('isRepresentative'),
    )
    .map((applicant) => ({
      name: applicant.nationalIdWithName.name,
      address: applicant.email,
    }))
}

export const mapPersonToArray = (person: ApplicantsInfo) => {
  return {
    nationalId: person.nationalIdWithName.nationalId,
    name: person.nationalIdWithName.name,
    email: person.email,
    phone: formatPhoneNumber(person.phone),
    address: person.address,
    isRepresentative: Boolean(
      person.isRepresentative.includes('isRepresentative'),
    ),
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
  landlordsMutualFundInfo: string | undefined,
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
      return landlordsMutualFundInfo
    default:
      return null
  }
}
