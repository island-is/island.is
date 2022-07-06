import { Field, ObjectType } from '@nestjs/graphql'
import { OperatingLicense } from './operatingLicense'
import { PaginationInfo } from './paginationInfo'

@ObjectType()
export class PaginatedOperatingLicenses {
  @Field({ nullable: true })
  paginationInfo?: PaginationInfo

  @Field({ nullable: true })
  searchQuery?: string

  @Field(() => [OperatingLicense])
  results?: OperatingLicense[]
}
