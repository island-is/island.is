import { Allow, IsInt, IsOptional, IsPositive, IsString } from 'class-validator'

import { Field, ID, InputType, Int } from '@nestjs/graphql'

@InputType()
export class UpdateCourtDocumentInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @Field(() => ID)
  readonly courtSessionId!: string

  @Allow()
  @Field(() => ID)
  readonly courtDocumentId!: string

  @Allow()
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
  readonly documentOrder?: number

  @Allow()
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
  readonly mergedDocumentOrder?: number

  @Allow()
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  readonly name?: string

  @Allow()
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  readonly submittedBy?: string
}
