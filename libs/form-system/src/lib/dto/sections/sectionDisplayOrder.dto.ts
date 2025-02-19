import { Field, InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

@InputType('FormSystemSectionDisplayOrderInput')
export class SectionDisplayOrderDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Field(() => String)
  id!: string
}
