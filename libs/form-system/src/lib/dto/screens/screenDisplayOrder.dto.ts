import { Field, InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

@InputType('FormSystemScreenDisplayOrderInput')
export class ScreenDisplayOrderDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Field(() => String)
  id!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Field(() => String)
  sectionId!: string
}
