import { Field, InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

@InputType('FormSystemCreateListItemInput')
export class CreateListItemDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Field(() => String)
  fieldId!: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Field(() => Number)
  displayOrder!: number
}
