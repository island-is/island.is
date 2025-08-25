import { Allow, IsOptional } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CaseStatisticsInput {
  @Allow()
  @IsOptional()
  @Field(() => Date, { nullable: true })
  readonly fromDate?: Date

  @Allow()
  @IsOptional()
  @Field(() => Date, { nullable: true })
  readonly toDate?: Date

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly institutionId?: string
}

@InputType()
export class DateFilter {
  @Allow()
  @IsOptional()
  @Field(() => Date, { nullable: true })
  readonly fromDate?: Date

  @Allow()
  @IsOptional()
  @Field(() => Date, { nullable: true })
  readonly toDate?: Date
}

@InputType()
export class RequestStatisticsInput {
  @Allow()
  @IsOptional()
  @Field(() => DateFilter, { nullable: true })
  readonly created?: DateFilter

  @Allow()
  @IsOptional()
  @Field(() => DateFilter, { nullable: true })
  readonly sentToCourt?: DateFilter

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly institutionId?: string
}

@InputType()
export class IndictmentStatisticsInput {
  @Allow()
  @IsOptional()
  @Field(() => DateFilter, { nullable: true })
  readonly sentToCourt?: DateFilter

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly institutionId?: string
}

@InputType()
export class SubpoenaStatisticsInput {
  @Allow()
  @IsOptional()
  @Field(() => DateFilter, { nullable: true })
  readonly created?: DateFilter

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly institutionId?: string
}
