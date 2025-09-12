import { getValueViaPath, YesOrNoEnum } from '@island.is/application/core'
import { Application, FormValue } from '@island.is/application/types'
import { ApplicantsInfo, LandlordInfo, PropertyUnit } from '../shared/types'
import * as m from '../lib/messages'
import { getRentalPropertySize } from './utils'

export const singularOrPluralLandlordsTitle = (application: Application) => {
  const landlords = getValueViaPath<Array<LandlordInfo>>(
    application.answers,
    'parties.landlordInfo.table',
  )?.filter((landlord) => !landlord.isRepresentative.includes('✔️'))

  if (!landlords) {
    return null
  }

  return landlords?.length > 1
    ? m.summary.landlordsHeaderPlural
    : m.summary.landlordsHeader
}

export const shouldShowRepresentative = (answers: FormValue) => {
  const representatives = getValueViaPath<Array<LandlordInfo>>(
    answers,
    'parties.landlordInfo.table',
  )?.filter((landlord) => landlord.isRepresentative.includes('✔️'))

  if (!representatives || representatives.length === 0) {
    return false
  }

  return representatives?.length > 0
}

export const singularOrPluralRepresentativeTitle = (
  application: Application,
) => {
  const representatives = getValueViaPath<Array<LandlordInfo>>(
    application.answers,
    'parties.landlordInfo.table',
  )?.filter((landlord) => landlord.isRepresentative.includes('✔️'))

  if (!representatives) {
    return null
  }

  return representatives?.length > 1
    ? m.summary.landlordsRepresentativeLabelPlural
    : m.summary.landlordsRepresentativeLabel
}

export const singularOrPluralTenantsTitle = (application: Application) => {
  const tenants = getValueViaPath<Array<ApplicantsInfo>>(
    application.answers,
    'parties.tenantInfo.table',
  )

  if (!tenants) {
    return null
  }

  return tenants?.length > 1
    ? m.summary.tenantsHeaderPlural
    : m.summary.tenantsHeader
}

export const shouldShowSmokeDetectorsAlert = (answers: FormValue) => {
  const smokeDetectors = getValueViaPath<string>(
    answers,
    'fireProtections.smokeDetectors',
  )

  if (!smokeDetectors) {
    return false
  }

  const propertySize = getValueViaPath<PropertyUnit[]>(
    answers,
    'registerProperty.searchresults.units',
  )

  const size = getRentalPropertySize(propertySize ?? [])

  const requiredSmokeDetectors = Math.ceil(Number(size) / 80)

  return Number(smokeDetectors) < requiredSmokeDetectors
}

export const securityDepositRequired = (answers: FormValue) => {
  const securityDepositRequired = getValueViaPath<Array<string>>(
    answers,
    'rentalAmount.securityDepositRequired',
  )
  return securityDepositRequired?.includes(YesOrNoEnum.YES) || false
}
