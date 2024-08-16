import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class CemeteryClientFinancialLimitInput {
  @Field(() => String)
  @IsString()
  clientType!: string

  @Field(() => String)
  @IsString()
  year!: string
}
