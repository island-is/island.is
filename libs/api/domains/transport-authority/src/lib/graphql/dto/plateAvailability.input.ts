import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class PlateAvailabilityInput {
  @Field(() => String)
  regno!: string
}
