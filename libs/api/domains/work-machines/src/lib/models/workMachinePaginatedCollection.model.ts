import { PaginatedResponse } from '@island.is/nest/pagination'
import { ObjectType, Field } from '@nestjs/graphql'
import { WorkMachine } from './workMachine.model'
import { CollectionLink } from './collectionLink.model'
import { Label } from './label.model'
import { DownloadLink } from './downloadLink.model'

@ObjectType('WorkMachinesPaginatedCollection')
export class PaginatedCollectionResponse extends PaginatedResponse(
  WorkMachine,
) {
  @Field(() => [CollectionLink], { nullable: true })
  links?: Array<CollectionLink>

  @Field(() => [Label], { nullable: true })
  labels?: Array<Label>

  @Field(() => [DownloadLink], { nullable: true })
  downloadServiceLinks?: Array<DownloadLink>
}
