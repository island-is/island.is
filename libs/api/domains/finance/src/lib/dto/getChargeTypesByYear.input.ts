import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType('FinanceChargeTypesByYearInput')
export class GetChargeTypesByYearInput {
  @Field()
  @IsString()
  year!: string
}
