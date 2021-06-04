import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { IsString, IsEnum } from 'class-validator'
import { UploadSignedFileDtoTypeEnum } from '../../../gen/fetch'

registerEnumType(UploadSignedFileDtoTypeEnum, {
  name: 'UploadSignedFileDtoTypeEnum',
})

@InputType()
export class UploadSignedFileInput {
  @Field(() => String)
  @IsString()
  id!: string

  @Field(() => String)
  @IsString()
  documentToken!: string

  @Field(() => UploadSignedFileDtoTypeEnum)
  @IsEnum(UploadSignedFileDtoTypeEnum)
  type!: UploadSignedFileDtoTypeEnum
}
