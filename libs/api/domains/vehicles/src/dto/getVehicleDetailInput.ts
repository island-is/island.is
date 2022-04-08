import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetVehicleDetailInput {
  @Field({ nullable: true })
  @IsString()
  permno?: string

  @Field()
  @IsString()
  regno!: string

  @Field({ nullable: true })
  @IsString()
  vin?: string
}
