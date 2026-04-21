import { Field, InputType, Int } from '@nestjs/graphql'

@InputType('GetOneSystemsRulingsInput')
export class GetOneSystemsRulingsInput {
  @Field(() => Int, {
    nullable: true,
    description:
      'The year for which to retrieve rulings. Must be between 2020 and the current year.',
  })
  year?: number

  @Field(() => Int, {
    nullable: true,
    description: 'Maximum number of records to return. Default: 100',
  })
  limit?: number

  @Field(() => Int, {
    nullable: true,
    description: 'The number of records to skip. Default: 0',
  })
  offset?: number
}
