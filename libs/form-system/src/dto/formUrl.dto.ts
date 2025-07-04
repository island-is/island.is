import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

@InputType('FormSystemFormUrlInput')
@ObjectType('FormSystemFormUrl')
export class FormUrlDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Field(() => String)
  formId!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Field(() => String)
  organizationUrlId!: string
}
