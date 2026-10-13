import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsArray, IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

@InputType()
export class GenericFormFieldValueInput {
  /** Contentful entry id of the form field */
  @Field()
  @IsString()
  id!: string

  /** Human readable value that the user entered for the form field */
  @Field()
  @IsString()
  value!: string
}

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

  /** Used to inject form field values into the email subject */
  @Field(() => [GenericFormFieldValueInput], { nullable: true })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => GenericFormFieldValueInput)
  fieldValues?: GenericFormFieldValueInput[]

  @Field(() => String, { nullable: true })
  lang?: string | null
}
