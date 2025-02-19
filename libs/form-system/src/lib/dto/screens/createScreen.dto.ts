import { Field, InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

@InputType('FormSystemCreateScreenInput')
export class CreateScreenDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Field(() => String)
  sectionId!: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Field(() => Number)
  displayOrder!: number
}
