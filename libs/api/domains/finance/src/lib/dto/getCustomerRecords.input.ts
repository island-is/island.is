import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsArray } from 'class-validator'

@InputType()
export class GetCustomerRecordsInput {
  @Field((type) => [String], { nullable: true })
  @IsArray()
  chargeTypeID!: Array<string>

  @Field()
  @IsString()
  dayFrom!: string

  @Field()
  @IsString()
  dayTo!: string
}
