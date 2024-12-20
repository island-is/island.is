import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetPublicVehicleSearchInput {
  @Field()
  @IsString()
  search!: string
}
