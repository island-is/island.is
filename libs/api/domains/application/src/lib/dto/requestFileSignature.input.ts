import { InputType, Field, registerEnumType } from '@nestjs/graphql'
import { RequestFileSignatureDtoTypeEnum } from '../../../gen/fetch'
import {IsString, IsEnum} from 'class-validator'

registerEnumType(RequestFileSignatureDtoTypeEnum, {
  name: 'RequestFileSignatureDtoTypeEnum',
})

@InputType()
export class RequestFileSignatureInput {
  @Field((type) => String)
  @IsString()
  id!: string

  @Field((type) => RequestFileSignatureDtoTypeEnum)
  @IsEnum(RequestFileSignatureDtoTypeEnum)
  type!: RequestFileSignatureDtoTypeEnum
}
