import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsArray, IsOptional } from 'class-validator'

@InputType()
export class GenericFormInput {
  @Field()
  @IsString()
  id!: string

  @Field()
  @IsString()
  name!: string

  @Field()
  @IsString()
  email!: string

  @Field()
  @IsString()
  message!: string

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  files?: string[]

  @Field({ nullable: true })
  recipientFormFieldDeciderValue?: string

  @Field(() => String, { nullable: true })
  lang?: string | null
}
