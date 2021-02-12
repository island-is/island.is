import { InputType, Field, registerEnumType } from '@nestjs/graphql'
import { CreatePdfDtoTypeEnum } from '../../../gen/fetch'
import { IsString, IsEnum } from 'class-validator'

registerEnumType(CreatePdfDtoTypeEnum, {
  name: 'CreatePdfDtoTypeEnum',
})

@InputType()
export class CreatePdfInput {
  @Field((type) => String)
  @IsString()
  id!: string

  @Field((type) => CreatePdfDtoTypeEnum)
  @IsEnum(CreatePdfDtoTypeEnum)
  type!: CreatePdfDtoTypeEnum
}
