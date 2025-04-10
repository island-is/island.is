import { PaginatedResponse } from '@island.is/nest/pagination'
import { ObjectType, Field } from '@nestjs/graphql'
import { WorkMachine } from './workMachine.model'
import { CollectionLink } from './collectionLink.model'
import { Label } from './label.model'

@ObjectType('WorkMachinesPaginatedCollection')
export class PaginatedCollectionResponse extends PaginatedResponse(
  WorkMachine,
) {
  @Field(() => [CollectionLink], { nullable: true })
  links?: Array<CollectionLink> | null

  @Field(() => [Label], { nullable: true })
  labels?: Array<Label> | null
}
