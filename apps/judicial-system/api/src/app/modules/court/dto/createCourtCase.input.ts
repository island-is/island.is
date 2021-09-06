import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import type {
  CaseType,
  CreateCourtCase,
} from '@island.is/judicial-system/types'

@InputType()
export class CreateCourtCaseInput implements CreateCourtCase {
  @Allow()
  @Field()
  readonly caseId!: string

  @Allow()
  @Field()
  readonly courtId!: string

  @Allow()
  @Field(() => String)
  readonly type!: CaseType

  @Allow()
  @Field()
  readonly policeCaseNumber!: string

  @Allow()
  @Field()
  readonly isExtension!: boolean
}
