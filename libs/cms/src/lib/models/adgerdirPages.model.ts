import { Field, ObjectType } from '@nestjs/graphql'
import { AdgerdirPage } from './adgerdirPage.model'

@ObjectType()
export class AdgerdirPages {
  @Field(() => [AdgerdirPage])
  items!: AdgerdirPage[]
}
