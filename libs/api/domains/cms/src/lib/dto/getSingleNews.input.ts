import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

@InputType()
export class GetSingleNewsInput {
  @Field()
  @IsString()
  slug: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  lang?: string
}
