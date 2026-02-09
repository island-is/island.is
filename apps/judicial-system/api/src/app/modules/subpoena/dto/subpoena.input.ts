import { Allow, IsArray, IsOptional } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class SubpoenaQueryInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @Field(() => ID)
  readonly defendantId!: string

  @Allow()
  @Field(() => ID)
  readonly subpoenaId!: string
}

@InputType()
export class CreateSubpoenasInput {
  @Allow()
  @IsArray()
  @Field(() => [ID])
  readonly defendantIds!: string[]

  @Allow()
  @Field(() => String, { nullable: false })
  readonly arraignmentDate!: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly location?: string
}
