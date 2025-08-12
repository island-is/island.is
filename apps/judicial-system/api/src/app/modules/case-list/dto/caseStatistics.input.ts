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
