import { Allow, IsOptional } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class CasePoliceDigitalCaseFilesQueryInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly policeCaseNumber?: string
}
