import { Field, InputType, Int } from '@nestjs/graphql'
import { IsInt, IsOptional, IsString, Min } from 'class-validator'

@InputType('AuthAdminTranslationsInput')
export class TranslationsInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  searchString?: string

  @Field(() => Int)
  @IsInt()
  @Min(1)
  page!: number

  @Field(() => Int)
  @IsInt()
  @Min(1)
  count!: number
}
