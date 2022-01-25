import { Field, ObjectType } from '@nestjs/graphql'

import { UpdateApplicationTableResponseType } from '@island.is/financial-aid/shared/lib'
import { ApplicationWithAttachments } from './application.model'
import { ApplicationFiltersModel } from './applicationFilter.model'

@ObjectType()
export class UpdateApplicationTableResponse
  implements UpdateApplicationTableResponseType {
  @Field(() => [ApplicationWithAttachments])
  readonly applications!: [ApplicationWithAttachments]

  @Field()
  readonly filters!: ApplicationFiltersModel
}
