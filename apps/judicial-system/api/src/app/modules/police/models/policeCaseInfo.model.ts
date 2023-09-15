import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PoliceCaseInfo {
  @Field(() => ID)
  readonly policeCaseNumber!: string
  @Field(() => String, { nullable: true })
  readonly place?: string

  @Field(() => String, { nullable: true })
  readonly date?: string
}
