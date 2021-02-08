import { InputType, Field, registerEnumType } from '@nestjs/graphql'
import { RequestFileSignatureDtoTypeEnum } from '../../../gen/fetch'

registerEnumType(RequestFileSignatureDtoTypeEnum, {
  name: 'RequestFileSignatureDtoTypeEnum',
})

@InputType()
export class RequestFileSignatureInput {
  @Field((type) => String)
  id!: string

  @Field((type) => RequestFileSignatureDtoTypeEnum)
  type!: RequestFileSignatureDtoTypeEnum
}
