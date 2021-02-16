import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { IsString, IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
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

  @ApiProperty({ enum: UploadSignedFileDtoTypeEnum })
  @IsEnum(UploadSignedFileDtoTypeEnum)
  readonly type!: UploadSignedFileDtoTypeEnum
}
