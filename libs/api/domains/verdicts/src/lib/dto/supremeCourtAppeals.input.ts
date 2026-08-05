import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { Int } from '@nestjs/graphql'

@InputType('WebSupremeCourtAppealsInput')
@ObjectType('WebSupremeCourtAppealsInputResponse')
export class SupremeCourtAppealsInput {
  @Field(() => Int)
  page!: number
}
