import { Allow, IsOptional, IsUUID } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class CreateAppealCaseInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @IsOptional()
  @IsUUID()
  @Field(() => String, { nullable: true })
  readonly rulingFileId?: string
}
