import { Field, InputType } from '@nestjs/graphql'
import { RecyclingRequestTypes } from '../recyclingRequest.model'

@InputType('CreateRecyclingRequestInput')
export class CreateRecyclingRequestInput {
  @Field()
  permno!: string

  @Field(() => RecyclingRequestTypes)
  requestType!: RecyclingRequestTypes
}
