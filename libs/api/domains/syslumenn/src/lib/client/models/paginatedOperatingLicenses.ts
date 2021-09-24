import { IOperatingLicense } from './operatingLicense'
import { IPaginationInfo } from './paginationInfo'

export interface IPaginatedOperatingLicenses {
  searchQuery: string
  paginationInfo: IPaginationInfo
  results: IOperatingLicense[]
}
