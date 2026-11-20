import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class EstatesFieldValue {
  @Field()
  label!: string

  @Field({ nullable: true })
  value?: string
}

@ObjectType()
export class EstatesDateFieldValue {
  @Field()
  label!: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  value?: Date
}
