import { Field, ID, InputType } from '@nestjs/graphql'

@InputType('LawAndOrderSubpoenaAcknowledgedInput')
export class PostSubpoenaAcknowledgedInput {
  @Field(() => ID)
  caseId!: string

  @Field()
  acknowledged!: boolean | undefined
}
