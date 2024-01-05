import { Field, ID, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PoliceCaseFile {
  @Field(() => ID)
  readonly id!: string

  @Field()
  readonly name!: string

  @Field()
  readonly policeCaseNumber!: string

  @Field(() => Int, { nullable: true })
  readonly chapter?: number

  @Field({ nullable: true })
  readonly displayDate?: string
}
