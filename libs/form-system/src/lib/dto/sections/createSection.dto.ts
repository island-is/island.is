import { Field, InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

@InputType('FormSystemCreateSection')
export class CreateSectionDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Field(() => String)
  formId!: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Field(() => Number)
  displayOrder!: number
}

@InputType('FormSystemCreateSectionInput')
export class CreateSectionInput {
  @Field(() => CreateSectionDto, { nullable: true })
  createSectionDto?: CreateSectionDto
}
