import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class InaoClientFinancialLimitInput {
  @Field(() => String)
  @IsString()
  clientType!: string

  @Field(() => String)
  @IsString()
  year!: string
}
