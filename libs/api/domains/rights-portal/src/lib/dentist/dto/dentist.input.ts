import { Field, InputType } from '@nestjs/graphql'

@InputType('RightsPortalDentistsInput')
export class DentistsInput {
  @Field(() => String)
  contractType!: string

  @Field(() => Number, { nullable: true })
  limit?: number

  @Field(() => String, { nullable: true })
  before?: string

  @Field(() => String, { nullable: true })
  after?: string

  @Field(() => Number, { nullable: true })
  pageNumber?: number

  @Field(() => String, { nullable: true })
  nameStartsWith?: string
}
