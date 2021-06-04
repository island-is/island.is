import { InputType, Field, registerEnumType } from '@nestjs/graphql'
import { RequestFileSignatureDtoTypeEnum } from '../../../gen/fetch'
import { IsString, IsEnum } from 'class-validator'

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
