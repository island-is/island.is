import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { IsEnum,IsString } from 'class-validator'

import { GeneratePdfDtoTypeEnum } from '../../../gen/fetch'

registerEnumType(GeneratePdfDtoTypeEnum, {
  name: 'GeneratePdfDtoTypeEnum',
})

@InputType()
export class GeneratePdfInput {
  @Field(() => String)
  @IsString()
  id!: string

  @Field(() => GeneratePdfDtoTypeEnum)
  @IsEnum(GeneratePdfDtoTypeEnum)
  type!: GeneratePdfDtoTypeEnum
}
