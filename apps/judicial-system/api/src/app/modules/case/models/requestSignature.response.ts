import { Field, ObjectType } from '@nestjs/graphql'

import { RequestSignatureResponse as TRequestSignatureResponse } from '@island.is/judicial-system/types'

@ObjectType()
export class RequestSignatureResponse implements TRequestSignatureResponse {
  @Field()
  controlCode: string

  @Field()
  documentToken: string
}
