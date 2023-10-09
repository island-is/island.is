import { Field, InputType } from '@nestjs/graphql'
import { MaxLength, MinLength } from 'class-validator'

@InputType()
export class PlateAvailabilityInput {
  @Field(() => String)
  @MinLength(2)
  @MaxLength(6)
  regno!: string
}
