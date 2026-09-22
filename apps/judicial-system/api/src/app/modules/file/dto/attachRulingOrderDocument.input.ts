import { Allow, IsOptional } from 'class-validator'

import { Field, ID, InputType, Int } from '@nestjs/graphql'

@InputType()
export class AttachRulingOrderDocumentInput {
  @Allow()
  @Field(() => ID)
  readonly id!: string

  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @Field(() => String)
  readonly type!: string

  @Allow()
  @Field(() => String)
  readonly key!: string

  @Allow()
  @Field(() => Int)
  readonly size!: number

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly userGeneratedFilename?: string
}
