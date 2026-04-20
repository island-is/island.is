import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('QuestionnaireAnsweredQuestion')
export class AnsweredQuestion {
  @Field()
  id!: string

  @Field({ nullable: true })
  label?: string

  @Field(() => [String])
  values!: string[]

  @Field({ nullable: true })
  htmlLabel?: string

  @Field({ nullable: true })
  sublabel?: string
}

@ObjectType('QuestionnaireAnsweredQuestionnaire')
export class AnsweredQuestionnaire {
  @Field()
  id!: string

  @Field({ nullable: true })
  formId?: string

  @Field({ nullable: true })
  submissionId?: string

  @Field({ nullable: true })
  isDraft?: boolean

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  date?: string

  @Field(() => [AnsweredQuestion])
  answers!: AnsweredQuestion[]
}

@ObjectType('QuestionnaireAnsweredQuestionnaires')
export class AnsweredQuestionnaires {
  @Field(() => [AnsweredQuestionnaire])
  data!: AnsweredQuestionnaire[]
}
