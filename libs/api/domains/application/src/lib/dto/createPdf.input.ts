import { InputType, Field, registerEnumType } from '@nestjs/graphql'
import { IsEnum, IsString } from 'class-validator'
import { CreatePdfDtoTypeEnum } from '../../../gen/fetch'

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
