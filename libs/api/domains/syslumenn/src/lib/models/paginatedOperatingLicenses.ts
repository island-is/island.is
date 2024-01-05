import { Field, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { OperatingLicense } from './operatingLicense'
import { PaginationInfo } from './paginationInfo'

@ObjectType()
export class PaginatedOperatingLicenses {
  @CacheField({ nullable: true })
  paginationInfo?: PaginationInfo

  @Field({ nullable: true })
  searchQuery?: string

  @CacheField(() => [OperatingLicense])
  results?: OperatingLicense[]
}
