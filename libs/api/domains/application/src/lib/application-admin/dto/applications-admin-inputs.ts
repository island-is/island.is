import { Field, InputType } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'

@InputType()
export class ApplicationsAdminFilters {
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

  @Field(() => String, { nullable: true })
  @IsOptional()
  typeIdValue?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  searchStr?: string

  @Field(() => [String], { nullable: true })
  @IsOptional()
  status?: string[]
}

@InputType()
export class ApplicationsSuperAdminFilters extends ApplicationsAdminFilters {
  @Field(() => String, { nullable: true })
  institutionNationalId?: string
}

@InputType()
export class ApplicationsAdminStatisticsInput {
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
