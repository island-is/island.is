import {} from '@island.is/clients/smartsolutions'
import { PaginationInput } from '@island.is/nest/pagination'
import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'

@InputType()
class FiltersAdminInput {
  @Field(() => [String], { nullable: true })
  @IsOptional()
  typeId?: string[]

  @Field(() => [String], { nullable: true })
  @IsOptional()
  status?: string[]
}

@InputType()
class PaginationQuery extends PaginationInput() {}
@InputType()
export class ApplicationApplicationsAdminInput extends PartialType(
  FiltersAdminInput,
) {
  @Field(() => String)
  nationalId!: string
}

@InputType()
export class ApplicationApplicationsInstitutionAdminInput extends OmitType(
  ApplicationApplicationsAdminInput,
  ['typeId'],
) {
  @Field(() => String, { nullable: true })
  @IsOptional()
  applicantNationalId?: string

  @Field(() => PaginationQuery, { nullable: true })
  @IsOptional()
  query?: PaginationQuery
}
