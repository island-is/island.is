import { Field, InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

@InputType('FormSystemCreateListItem')
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

@InputType('FormSystemCreateListItemInput')
export class CreateListItemInput {
  @Field(() => CreateListItemDto, { nullable: true })
  createListItemDto?: CreateListItemDto
}
