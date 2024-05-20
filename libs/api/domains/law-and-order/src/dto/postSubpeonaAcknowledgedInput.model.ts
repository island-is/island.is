import { Field, ID, InputType } from '@nestjs/graphql'

@InputType('LawAndOrderSubpeonaAcknowledgedInput')
export class PostSubpeonaAcknowledgedInput {
  @Field(() => ID)
  id!: string

  @Field(() => Boolean)
  acknowledged!: boolean | undefined
}
