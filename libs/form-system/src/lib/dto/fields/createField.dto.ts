import { Field, InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

@InputType('FormSystemCreateFieldInput')
export class CreateFieldDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Field(() => String)
  screenId!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Field(() => String)
  fieldType!: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Field(() => Number)
  displayOrder!: number
}
