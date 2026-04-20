import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { Int } from '@nestjs/graphql'

@InputType('WebSupremeCourtDeterminationsInput')
@ObjectType('WebSupremeCourtDeterminationsInputResponse')
export class SupremeCourtDeterminationsInput {
  @Field(() => Int)
  page!: number
}
