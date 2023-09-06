import { Field, ObjectType } from '@nestjs/graphql'

import type { UploadPoliceCaseFileResponse as TUploadPoliceCaseFileResponse } from '@island.is/judicial-system/types'

@ObjectType()
export class UploadPoliceCaseFileResponse
  implements TUploadPoliceCaseFileResponse
{
  @Field()
  key!: string

  @Field()
  size!: number
}
