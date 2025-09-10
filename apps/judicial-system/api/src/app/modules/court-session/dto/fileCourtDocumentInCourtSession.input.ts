import { IsUUID } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class FileCourtDocumentInCourtSessionInput {
  @Field(() => ID)
  @IsUUID()
  readonly caseId!: string

  @Field(() => ID)
  @IsUUID()
  readonly courtSessionId!: string

  @Field(() => ID)
  @IsUUID()
  readonly courtDocumentId!: string
}
