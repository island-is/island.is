import { InputType, Field, registerEnumType } from '@nestjs/graphql'
import { GeneratePdfDtoTypeEnum } from '../../../gen/fetch'
import { IsString, IsEnum } from 'class-validator'

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
