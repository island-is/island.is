import { PaginatedResponse } from '@island.is/nest/pagination'
import { ObjectType, Field } from '@nestjs/graphql'
import { WorkMachine } from './workMachine.model'
import { CollectionLink } from './toBeDeprecated/collectionLink.model'
import { Label } from './label.model'
import { Link } from './link.model'

@ObjectType('WorkMachinesPaginatedCollection')
export class PaginatedCollectionResponse extends PaginatedResponse(
  WorkMachine,
) {
  @Field(() => [Link], {
    nullable: true,
  })
  linkCollection?: Array<Link>

  @Field(() => [Label], { nullable: true })
  labels?: Array<Label>

  //DEPRECATION LINE

  @Field(() => [CollectionLink], {
    nullable: true,
    deprecationReason: 'Use linkCollection instead, newer type',
  })
  links?: Array<CollectionLink>
}
