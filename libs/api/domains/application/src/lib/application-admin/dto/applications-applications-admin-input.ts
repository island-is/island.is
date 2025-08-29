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
  @Field(() => Number)
  page!: number

  @Field(() => Number)
  count!: number

  @Field(() => String, { nullable: true })
  @IsOptional()
  applicantNationalId?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  from?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  to?: string

  // Note: Need to create new field (typeIdValue) instead of using typeId because of DelegationGuard
  @Field(() => String, { nullable: true })
  @IsOptional()
  typeIdValue?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  searchStrValue?: string
}

@InputType()
export class ApplicationApplicationsAdminStatisticsInput {
  @Field(() => String)
  startDate!: string
  @Field(() => String)
  endDate!: string
}

@InputType()
export class ApplicationTypesInstitutionAdminInput {
  @Field(() => String)
  nationalId!: string
}
