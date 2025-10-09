import { Field, InputType, ID } from '@nestjs/graphql'
import { AnswerOptionType } from '../../models/question.model'

@InputType()
export class QuestionnaireEntryInput {
  @Field()
  entryID!: string

  @Field(() => [String])
  values!: string[]

  @Field(() => AnswerOptionType)
  type!: AnswerOptionType
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
