import { Field, ObjectType } from '@nestjs/graphql'
import { RegulationsItemModel } from './RegulationsItem'

@ObjectType()
export class RegulationsModel {
  @Field()
  page!: number
  @Field()
  perPage!: number
  @Field()
  totalPages!: number
  @Field(() => [RegulationsItemModel])
  data!: RegulationsItemModel[]
}
