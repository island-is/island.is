import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Area } from './area.model'

@ObjectType()
export class Collection {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string

  @Field(() => [Area])
  areas!: Area[]

  @Field(() => Date)
  endTime!: Date

  @Field(() => Date)
  startTime!: Date
}
