import { Field, InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { FieldDisplayOrderDto } from './fieldDisplayOrder.dto'
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

@InputType('FormSystemUpdateFieldsDisplayOrderInput')
export class UpdateFieldsDisplayOrderDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => FieldDisplayOrderDto)
  @IsArray()
  @ApiProperty({ type: [FieldDisplayOrderDto] })
  @Field(() => [FieldDisplayOrderDto], { nullable: 'itemsAndList' })
  fieldsDisplayOrderDto!: FieldDisplayOrderDto[]
}
