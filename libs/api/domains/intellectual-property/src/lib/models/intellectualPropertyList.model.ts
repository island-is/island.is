import { ObjectType, Field, Int } from '@nestjs/graphql'
import { IntellectualProperty } from './intellectualProperty.model'

@ObjectType('IntellectualPropertyList')
export class IntellectualPropertyList {
  @Field(() => Int)
  count!: number

  @Field(() => [IntellectualProperty, { nullable: true }])
  items?: Array<typeof IntellectualProperty> | null
}
