import { ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { Organization } from './organization.model'

@ObjectType()
export class Organizations {
  @CacheField(() => [Organization])
  items!: Organization[]
}
