import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString, IsArray } from 'class-validator'

@InputType()
export class GetTranslationsInput {
  @Field((type) => [String], { nullable: true })
  @IsString({ each: true })
  @IsOptional()
  namespaces?: Array<string>

  @Field()
  @IsString()
  lang: string
}
