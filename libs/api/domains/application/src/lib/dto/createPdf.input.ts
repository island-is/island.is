import { InputType, Field } from '@nestjs/graphql'
import {
  IsEnum,
  IsString
} from 'class-validator'
import { PDF_TYPES } from '@island.is/application/api-template-utils'

@InputType()
export class CreatePdfInput {
  @Field((type) => String)
  @IsString()
  id!: string

  @IsEnum(PDF_TYPES)
  type!: PDF_TYPES
}
