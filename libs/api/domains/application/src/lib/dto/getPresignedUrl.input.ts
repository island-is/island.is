import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { IsString, IsEnum } from 'class-validator'
import { PresignedUrlDtoTypeEnum } from '../../../gen/fetch'

registerEnumType(PresignedUrlDtoTypeEnum, {
  name: 'PresignedUrlDtoTypeEnum',
})

@InputType()
export class GetPresignedUrlInput {
  @Field(() => String)
  @IsString()
  id!: string

  @Field(() => PresignedUrlDtoTypeEnum)
  @IsEnum(PresignedUrlDtoTypeEnum)
  type!: PresignedUrlDtoTypeEnum
}
