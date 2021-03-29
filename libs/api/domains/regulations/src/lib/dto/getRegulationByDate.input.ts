import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetRegulationByDateInput {
  @Field()
  @IsString()
  name!: string
  @Field()
  @IsString()
  date!: string
}
