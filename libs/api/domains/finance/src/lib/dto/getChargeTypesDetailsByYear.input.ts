import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetChargeTypesDetailsByYearInput {
  @Field()
  @IsString()
  year!: string

  @Field()
  @IsString()
  typeId!: string
}
