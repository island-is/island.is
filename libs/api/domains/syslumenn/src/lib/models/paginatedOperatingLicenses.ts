import { Field, ObjectType } from '@nestjs/graphql'
import { IPaginatedOperatingLicenses } from '../client/models/paginatedOperatingLicenses'
import { OperatingLicense, mapOperatingLicense } from './operatingLicense'
import { PaginationInfo, mapPaginationInfo } from './paginationInfo'

@ObjectType()
export class PaginatedOperatingLicenses {
  @Field({ nullable: true })
  paginationInfo?: PaginationInfo

  @Field({ nullable: true })
  searchQuery?: string

  @Field(() => [OperatingLicense])
  results?: OperatingLicense[]
}

export const mapPaginatedOperatingLicenses = (
  paginatedOperatingLicenses: IPaginatedOperatingLicenses,
): PaginatedOperatingLicenses => ({
  paginationInfo: mapPaginationInfo(paginatedOperatingLicenses.paginationInfo),
  searchQuery: paginatedOperatingLicenses.searchQuery,
  results: (paginatedOperatingLicenses.results ?? []).map(mapOperatingLicense),
})
