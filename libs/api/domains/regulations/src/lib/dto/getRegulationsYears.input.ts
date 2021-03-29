import { ISODate } from '@island.is/clients/regulations'
import { Field, InputType } from '@nestjs/graphql'
import { IsNumber, IsOptional, IsString } from 'class-validator'

@InputType()
export class GetRegulationsYearsInput {
  @Field()
  @IsOptional()
  year?: number
}
