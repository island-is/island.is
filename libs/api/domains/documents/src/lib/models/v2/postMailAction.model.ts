import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('DocumentV2PostMailAction')
export class PostMailAction {
  @Field(() => [String])
  documentIds!: Array<string>
}
