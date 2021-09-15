import { Field, ObjectType } from '@nestjs/graphql'

import type { UploadFileToCourtResponse as TUploadFileToCourtResponse } from '@island.is/judicial-system/types'

@ObjectType()
export class UploadFileToCourtResponse implements TUploadFileToCourtResponse {
  @Field()
  readonly success!: boolean
}
