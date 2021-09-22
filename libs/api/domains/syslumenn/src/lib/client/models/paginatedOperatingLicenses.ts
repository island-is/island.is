import { IOperatingLicense } from './operatingLicense'
import { IPaginationInfo } from './paginationInfo'

export interface IPaginatedOperatingLicenses {
  paginationInfo: IPaginationInfo
  results: IOperatingLicense[]
}
