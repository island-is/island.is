import { Field, ID, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PoliceCaseFile {
  @Field(() => ID)
  readonly id!: string

  @Field(() => String)
  readonly name!: string

  @Field(() => String)
  readonly policeCaseNumber!: string

  @Field(() => Int, { nullable: true })
  readonly chapter?: number

  @Field(() => String, { nullable: true })
  readonly displayDate?: string

  @Field(() => String, { nullable: true })
  readonly type?: string
}
