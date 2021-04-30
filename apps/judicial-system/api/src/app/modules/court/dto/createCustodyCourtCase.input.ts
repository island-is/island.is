import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { CreateCustodyCourtCase } from '@island.is/judicial-system/types'

@InputType()
export class CreateCustodyCourtCaseInput implements CreateCustodyCourtCase {
  @Allow()
  @Field()
  readonly caseId!: string

  @Allow()
  @Field()
  readonly policeCaseNumber!: string
}
