import { Field, InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

@InputType('FormSystemCreateScreen')
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

@InputType('FormSystemCreateScreenInput')
export class CreateScreenInput {
  @Field(() => CreateScreenDto, { nullable: true })
  createScreenDto?: CreateScreenDto
}
