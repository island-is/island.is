import { Allow } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class FileCourtDocumentInCourtSessionInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @Field(() => ID)
  readonly courtSessionId!: string

  @Allow()
  @Field(() => ID)
  readonly courtDocumentId!: string
}
