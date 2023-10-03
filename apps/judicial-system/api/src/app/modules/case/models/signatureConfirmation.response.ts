import { Field, ObjectType } from '@nestjs/graphql'

import type { SignatureConfirmationResponse as TSignatureConfirmationResponse } from '@island.is/judicial-system/types'

@ObjectType()
export class SignatureConfirmationResponse
  implements TSignatureConfirmationResponse
{
  @Field()
  documentSigned!: boolean

  @Field({ nullable: true })
  code?: number

  @Field({ nullable: true })
  message?: string
}
