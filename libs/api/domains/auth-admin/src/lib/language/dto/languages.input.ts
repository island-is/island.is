import { Field, InputType, Int } from '@nestjs/graphql'
import { IsInt, IsOptional, IsString, Min } from 'class-validator'

@InputType('AuthAdminLanguagesInput')
export class LanguagesInput {
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
