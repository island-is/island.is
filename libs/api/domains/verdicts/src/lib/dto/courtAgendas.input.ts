import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'

@InputType('WebCourtAgendasInput')
@ObjectType('WebCourtAgendasInputResponse')
export class CourtAgendasInput {
  @Field(() => Int, { nullable: true })
  page?: number
}
