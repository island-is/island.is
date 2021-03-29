import { ISODate } from '@island.is/clients/regulations'
import { Field, InputType } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'

@InputType()
export class GetRegulationsLawChaptersInput {
  @Field(() => Boolean)
  @IsOptional()
  tree?: boolean
}
