import { Field, InputType } from '@nestjs/graphql'

@InputType('RightsPortalDrugInput')
export class DrugInput {
  @Field(() => String, { nullable: true })
  nameStartsWith?: string

  @Field(() => Number, { nullable: true })
  limit?: number

  @Field(() => Number, { nullable: true })
  pageNumber?: number

  @Field(() => String, { nullable: true })
  before?: string

  @Field(() => String, { nullable: true })
  after?: string
}
