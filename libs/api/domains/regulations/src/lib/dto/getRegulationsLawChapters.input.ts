import { Field, InputType } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'

@InputType()
export class GetRegulationsLawChaptersInput {
  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  tree?: boolean
}
