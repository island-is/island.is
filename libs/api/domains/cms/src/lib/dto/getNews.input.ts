import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

@InputType()
export class GetNewsInput {
  @Field()
  @IsString()
  slug: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  lang?: string
}
