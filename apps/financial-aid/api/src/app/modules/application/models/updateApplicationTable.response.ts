import { Field, ObjectType } from '@nestjs/graphql'

import { UpdateApplicationTableResponseType } from '@island.is/financial-aid/shared/lib'
import { ApplicationModel } from './application.model'
import { ApplicationFiltersModel } from './applicationFilter.model'

@ObjectType()
export class UpdateApplicationTableResponse
  implements UpdateApplicationTableResponseType
{
  @Field(() => [ApplicationModel])
  readonly applications!: [ApplicationModel]

  @Field()
  readonly filters!: ApplicationFiltersModel
}
