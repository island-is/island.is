import { GenericLicenseType } from '@island.is/api/schema'
import { LicensePathType } from '../lib/constants'

export const isLicenseTypePath = (str: string): str is LicensePathType => {
  return (
    str === 'adrrettindi' ||
    str === 'okurettindi' ||
    str === 'ororkuskirteini' ||
    str === 'skotvopnaleyfi' ||
    str === 'vinnuvelarettindi' ||
    str === 'veidikort' ||
    str === 'pkort' ||
    str === 'ehic' ||
    str === 'vegabref' ||
    str === 'nafnskirteini'
  )
}

export const getTypeFromPath = (path: LicensePathType): GenericLicenseType => {
  switch (path) {
    case 'adrrettindi':
      return GenericLicenseType.AdrLicense
    case 'okurettindi':
      return GenericLicenseType.DriversLicense
    case 'ororkuskirteini':
      return GenericLicenseType.DisabilityLicense
    case 'skotvopnaleyfi':
      return GenericLicenseType.FirearmLicense
    case 'vinnuvelarettindi':
      return GenericLicenseType.MachineLicense
    case 'veidikort':
      return GenericLicenseType.HuntingLicense
    case 'pkort':
      return GenericLicenseType.PCard
    case 'ehic':
      return GenericLicenseType.Ehic
    case 'vegabref':
      return GenericLicenseType.Passport
    case 'nafnskirteini':
      return GenericLicenseType.IdentityDocument
  }
}

export const getPathFromType = (type: GenericLicenseType): LicensePathType => {
  switch (type) {
    case GenericLicenseType.AdrLicense:
      return 'adrrettindi'
    case GenericLicenseType.DriversLicense:
      return 'okurettindi'
    case GenericLicenseType.DisabilityLicense:
      return 'ororkuskirteini'
    case GenericLicenseType.FirearmLicense:
      return 'skotvopnaleyfi'
    case GenericLicenseType.MachineLicense:
      return 'vinnuvelarettindi'
    case GenericLicenseType.HuntingLicense:
      return 'veidikort'
    case GenericLicenseType.PCard:
      return 'pkort'
    case GenericLicenseType.Ehic:
      return 'ehic'
    case GenericLicenseType.Passport:
      return 'vegabref'
    case GenericLicenseType.IdentityDocument:
      return 'nafnskirteini'
  }
}
