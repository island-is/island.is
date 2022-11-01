import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetDiscountInput {
  @IsString()
  @Field()
  nationalId!: string
}
