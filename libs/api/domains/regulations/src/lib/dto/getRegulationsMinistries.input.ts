import { ISODate } from '@island.is/clients/regulations'
import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString, isString } from 'class-validator'

@InputType()
export class GetRegulationsMinistriesInput {
  @Field()
  @IsOptional()
  slug?: string
}
