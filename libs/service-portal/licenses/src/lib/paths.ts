import { GenericLicenseType } from '@island.is/api/schema'
import { LicensePathType } from './constants'

export enum LicensePaths {
  LicensesRoot = '/skirteini',
  LicensesDetail = '/skirteini/:type/:id',
}
