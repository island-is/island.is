import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class VehiclesListInputV3 {
  @Field()
  pageSize!: number

  @Field()
  page!: number
}