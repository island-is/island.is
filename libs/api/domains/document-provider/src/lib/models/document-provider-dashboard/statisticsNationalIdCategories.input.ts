import { Field, InputType } from '@nestjs/graphql'

@InputType('ApiV1StatisticsNationalIdCategoriesGetRequest')
export class ApiV1StatisticsNationalIdCategoriesGetRequest {
  @Field()
  nationalId!: string

  @Field(() => Date, { nullable: true })
  from?: Date

  @Field(() => Date, { nullable: true })
  to?: Date
}
