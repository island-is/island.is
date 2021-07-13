import { MinistrySlug } from '@hugsmidjan/regulations-editor/types'
import { Field, InputType } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'

@InputType()
export class GetRegulationsMinistriesInput {
  @Field(() => [String], { nullable: true })
  @IsOptional()
  slugs?: MinistrySlug[]
}
