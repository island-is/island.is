import { Field, ObjectType } from '@nestjs/graphql'
import { MinistryModel } from './ministry'

@ObjectType()
export class RegulationsItemModel {
  @Field()
  title!: string
  @Field()
  name!: string
  @Field(() => Date, { nullable: true })
  publishedDate!: string
  @Field(() => MinistryModel)
  ministry!: MinistryModel
}
