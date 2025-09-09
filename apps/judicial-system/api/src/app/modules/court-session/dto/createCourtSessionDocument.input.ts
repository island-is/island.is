import { IsString, IsUUID } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class CreateCourtSessionDocumentInput {
  @Field(() => ID)
  @IsUUID()
  readonly caseId!: string

  @Field(() => ID)
  @IsUUID()
  readonly courtSessionId!: string

  @Field(() => String)
  @IsString()
  readonly name!: string
}
