import { InputType, Field, registerEnumType } from '@nestjs/graphql'
import { CreatePdfDtoTypeEnum } from '../../../gen/fetch'
import { IsString, IsEnum } from 'class-validator'

registerEnumType(CreatePdfDtoTypeEnum, {
  name: 'CreatePdfDtoTypeEnum',
})

@InputType()
export class CreatePdfInput {
  @Field(() => String)
  @IsString()
  id!: string

  @Field(() => CreatePdfDtoTypeEnum)
  @IsEnum(CreatePdfDtoTypeEnum)
  type!: CreatePdfDtoTypeEnum
}
