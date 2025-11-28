import { getValueViaPath, YES, YesOrNoEnum } from '@island.is/application/core'
import {
  Application,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import { ApplicantsInfo, PropertyUnit } from '../shared/types'
import * as m from '../lib/messages'
import { getRentalPropertySize } from './utils'
import { ApplicantsRole } from './enums'

export const singularOrPluralLandlordsTitle = (application: Application) => {
  const landlords = getValueViaPath<Array<ApplicantsInfo>>(
    application.answers,
    'parties.landlordInfo.table',
  )

  if (!landlords) {
    return null
  }

  return landlords?.length > 1
    ? m.overview.landlordsHeaderPlural
    : m.overview.landlordsHeader
}

export const shouldShowRepresentative = (answers: FormValue) => {
  const representatives = getValueViaPath<Array<ApplicantsInfo | string>>(
    answers,
    'parties.landlordInfo.representativeTable',
  )

  if (
    !representatives ||
    representatives.length === 0 ||
    representatives[0] === '' ||
    (typeof representatives[0] === 'object' &&
      representatives[0]?.nationalIdWithName?.nationalId === '')
  ) {
    return false
  }

  return representatives?.length > 0
}

export const singularOrPluralRepresentativeTitle = (
  application: Application,
) => {
  const representatives = getValueViaPath<Array<ApplicantsInfo>>(
    application.answers,
    'parties.landlordInfo.representativeTable',
  )

  if (!representatives) {
    return null
  }

  return representatives?.length > 1
    ? m.overview.landlordsRepresentativeLabelPlural
    : m.overview.landlordsRepresentativeLabel
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
    ? m.overview.tenantsHeaderPlural
    : m.overview.tenantsHeader
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

export const shouldFireExtinguisherAlert = (answers: FormValue) => {
  const fireExtinguisher = getValueViaPath<string>(
    answers,
    'fireProtections.fireExtinguisher',
  )

  if (!fireExtinguisher) {
    return false
  }

  return Number(fireExtinguisher) < 1
}

export const securityDepositRequired = (answers: FormValue) => {
  const securityDepositRequired = getValueViaPath<Array<string>>(
    answers,
    'rentalAmount.securityDepositRequired',
  )
  return securityDepositRequired?.includes(YesOrNoEnum.YES) || false
}

export const shouldShowRepresentativeTable = (answers: FormValue) => {
  const shouldShowRepresentativeTable = getValueViaPath<Array<string>>(
    answers,
    'parties.landlordInfo.shouldShowRepresentativeTable',
  )
  return shouldShowRepresentativeTable?.includes(YES) || false
}

export const shouldShowRepresentativeStaticTable = (answers: FormValue) => {
  const applicantRole = getValueViaPath<string>(
    answers,
    'assignApplicantParty.applicantsRole',
  )

  return applicantRole === ApplicantsRole.REPRESENTATIVE
}

export const applicantIsIndividual = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const identityType = getValueViaPath<string>(
    externalData,
    'identity.data.type',
  )

  return identityType !== 'company'
}

export const applicantIsCompany = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const identityType = getValueViaPath<string>(
    externalData,
    'identity.data.type',
  )

  return identityType === 'company'
}
