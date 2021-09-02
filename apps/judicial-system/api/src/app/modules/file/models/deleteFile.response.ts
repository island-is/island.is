import { Field, ObjectType } from '@nestjs/graphql'

import type { DeleteFileResponse as TDeleteFileResponse } from '@island.is/judicial-system/types'

@ObjectType()
export class DeleteFileResponse implements TDeleteFileResponse {
  @Field()
  readonly success!: boolean
}
