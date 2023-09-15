import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetVehicleSearchInput {
  @Field()
  @IsString()
  search!: string
}
