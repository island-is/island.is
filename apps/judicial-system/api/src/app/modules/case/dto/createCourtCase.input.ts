import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateCourtCaseInput {
  @Allow()
  @Field()
  readonly caseId!: string
}
