import { Field, ObjectType } from '@nestjs/graphql'
import { ApplicationPagination } from '@island.is/financial-aid/shared/lib'
import { ApplicationModel } from './application.model'

@ObjectType()
export class FilterApplicationsResponse implements ApplicationPagination {
  @Field(() => [ApplicationModel])
  readonly applications!: [ApplicationModel]

  @Field()
  readonly totalCount!: number
}
