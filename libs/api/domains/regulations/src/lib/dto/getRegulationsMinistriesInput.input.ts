import { MinistrySlug } from '@dmr.is/regulations-tools/types'
import { Field, InputType } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'

@InputType()
export class GetRegulationsMinistriesInput {
  @Field(() => [String], { nullable: true })
  @IsOptional()
  slugs?: MinistrySlug[]
}
