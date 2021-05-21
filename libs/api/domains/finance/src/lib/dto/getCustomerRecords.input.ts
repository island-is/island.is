import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetCustomerRecordsInput {
  @Field()
  @IsString()
  chargeTypeID!: string

  @Field()
  @IsString()
  dayFrom!: string

  @Field()
  @IsString()
  dayTo!: string
}
