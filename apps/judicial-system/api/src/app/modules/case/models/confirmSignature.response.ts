import { Field, ObjectType } from '@nestjs/graphql'

import { ConfirmSignatureResponse as TConfirmSignatureResponse } from '@island.is/judicial-system/types'

@ObjectType()
export class ConfirmSignatureResponse implements TConfirmSignatureResponse {
  @Field()
  documentSigned: boolean

  @Field({ nullable: true })
  code: number

  @Field({ nullable: true })
  message: string
}
