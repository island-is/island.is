import { Field, InputType } from '@nestjs/graphql'

@InputType('CreateRecyclingRequestInput')
export class CreateRecyclingRequestInput {
  @Field()
  permno!: string
}
