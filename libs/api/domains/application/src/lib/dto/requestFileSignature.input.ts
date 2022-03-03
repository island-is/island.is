import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { IsEnum,IsString } from 'class-validator'

import { RequestFileSignatureDtoTypeEnum } from '../../../gen/fetch'

registerEnumType(RequestFileSignatureDtoTypeEnum, {
  name: 'RequestFileSignatureDtoTypeEnum',
})

@InputType()
export class RequestFileSignatureInput {
  @Field(() => String)
  @IsString()
  id!: string

  @Field(() => RequestFileSignatureDtoTypeEnum)
  @IsEnum(RequestFileSignatureDtoTypeEnum)
  type!: RequestFileSignatureDtoTypeEnum
}
