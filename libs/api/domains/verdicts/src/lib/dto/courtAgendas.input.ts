import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'

@InputType('WebCourtAgendasInput')
@ObjectType('WebCourtAgendasInputResponse')
export class CourtAgendasInput {
  @Field(() => Int, { nullable: true })
  page?: number

  @Field(() => String, { nullable: true })
  court?: string

  @Field(() => String, { nullable: true })
  dateFrom?: string

  @Field(() => String, { nullable: true })
  dateTo?: string

  @Field(() => String, { nullable: true })
  lawyer?: string
}
