import { Field, InputType, ID } from '@nestjs/graphql'

@InputType()
export class QuestionnaireEntryInput {
  @Field()
  entryID!: string

  @Field(() => [String])
  values!: string[]

  @Field()
  type!: string
}

@InputType()
export class QuestionnaireInput {
  @Field(() => ID)
  id!: string

  @Field()
  formId!: string

  @Field(() => [QuestionnaireEntryInput])
  entries!: QuestionnaireEntryInput[]
}
