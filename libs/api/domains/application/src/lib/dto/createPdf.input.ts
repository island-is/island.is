import { InputType, Field, registerEnumType } from '@nestjs/graphql'
import { CreatePdfDtoTypeEnum } from '../../../gen/fetch'

registerEnumType(CreatePdfDtoTypeEnum, {
  name: 'CreatePdfDtoTypeEnum',
})

@InputType()
export class CreatePdfInput {
  @Field((type) => String)
  id!: string

  @Field((type) => CreatePdfDtoTypeEnum)
  type!: CreatePdfDtoTypeEnum
}
