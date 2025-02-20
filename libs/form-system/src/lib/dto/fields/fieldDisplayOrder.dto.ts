import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

@ObjectType('FormSystemFieldDisplayOrder')
@InputType('FormSystemFieldDisplayOrderInput')
export class FieldDisplayOrderDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Field(() => String)
  id!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Field(() => String)
  screenId!: string
}
