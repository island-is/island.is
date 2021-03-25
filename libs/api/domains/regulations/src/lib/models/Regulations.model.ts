import { Field, ObjectType } from '@nestjs/graphql'
import { RegulationsItem } from './RegulationsItem.model'

@ObjectType()
export class Regulations {
  @Field()
  page!: number
  @Field()
  totalPages!: number
  @Field(() => [RegulationsItem])
  data!: RegulationsItem
}
