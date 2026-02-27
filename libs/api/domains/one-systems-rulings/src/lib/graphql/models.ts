import { Field, ID, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('OneSystemsRuling')
export class OneSystemsRuling {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  description!: string

  @Field()
  publishedDate!: Date
}

@ObjectType('OneSystemsRulingsResponse')
export class OneSystemsRulingsResponse {
  @Field(() => [OneSystemsRuling])
  rulings!: OneSystemsRuling[]

  @Field(() => Int)
  totalCount!: number
}

@ObjectType('OneSystemsRulingPdfResponse')
export class OneSystemsRulingPdfResponse {
  @Field()
  base64!: string

  @Field()
  contentType!: string
}
