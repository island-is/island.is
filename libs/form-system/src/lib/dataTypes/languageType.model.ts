import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

@InputType('FormSystemLanguageTypeInput')
@ObjectType('FormSystemLanguageType')
export class LanguageType {
  @IsString()
  @ApiProperty({ type: String, default: '' })
  @Field(() => String, { nullable: true })
  is = ''

  @IsString()
  @ApiProperty({ type: String, default: '' })
  @Field(() => String, { nullable: true })
  en = ''
}
