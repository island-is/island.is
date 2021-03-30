import { Field, ObjectType } from '@nestjs/graphql'

import { DeleteFileResponse as TDeleteFileResponse } from '@island.is/judicial-system/types'

@ObjectType()
export class DeleteFile implements TDeleteFileResponse {
  @Field()
  readonly success!: boolean
}
