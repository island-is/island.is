import { UpdateApplicationResponse } from '@island.is/financial-aid/shared/lib'
import { Field, ObjectType, ID } from '@nestjs/graphql'

import { ApplicationModel } from './application.model'
import { ApplicationFiltersModel } from './applicationFilter.model'

@ObjectType()
export class UpdateApplicationResponseModel
  implements UpdateApplicationResponse {
  @Field()
  readonly application!: ApplicationModel

  @Field()
  readonly filters?: ApplicationFiltersModel
}
