import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsOptional } from 'class-validator'

@InputType()
export class GetLifeEventsInCategoryInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  slug?: string

  @Field()
  @IsString()
  lang: string
}
