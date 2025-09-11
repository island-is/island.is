import { Allow, IsString } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class CreateCourtDocumentInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @Field(() => ID)
  readonly courtSessionId!: string

  @Allow()
  @IsString()
  @Field(() => String)
  readonly name!: string
}
