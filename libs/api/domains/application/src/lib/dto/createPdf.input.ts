import { InputType, Field } from '@nestjs/graphql'
import {
  IsEnum,
  IsString
} from 'class-validator'
import { CreatePdfDtoTypeEnum } from '../../../gen/fetch'

@InputType()
export class CreatePdfInput {
  @Field((type) => String)
  @IsString()
  id!: string

  @IsEnum(CreatePdfDtoTypeEnum)
  type!: CreatePdfDtoTypeEnum
}
