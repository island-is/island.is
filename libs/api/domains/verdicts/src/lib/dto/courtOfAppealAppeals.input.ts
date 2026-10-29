import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { Int } from '@nestjs/graphql'

@InputType('WebCourtOfAppealAppealsInput')
@ObjectType('WebCourtOfAppealAppealsInputResponse')
export class CourtOfAppealAppealsInput {
  @Field(() => Int)
  page!: number
}
