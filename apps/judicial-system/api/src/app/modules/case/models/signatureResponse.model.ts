import { Field, ObjectType } from '@nestjs/graphql'

import { SignatureResponse as TSignatureResponse } from '@island.is/judicial-system/types'

@ObjectType()
export class SignatureResponse implements TSignatureResponse {
  @Field()
  documentSigned: boolean

  @Field({ nullable: true })
  code: number

  @Field({ nullable: true })
  message: string
}
