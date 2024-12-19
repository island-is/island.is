import { Field, InputType, ObjectType } from '@nestjs/graphql'

@InputType('WebVerdictsInput')
@ObjectType('WebVerdictsInputResponse')
export class VerdictsInput {
  @Field(() => String, { nullable: true })
  searchTerm?: string

  // TODO: Add more fields
}
