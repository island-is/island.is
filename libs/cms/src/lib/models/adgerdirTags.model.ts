import { Field, ObjectType } from '@nestjs/graphql'
import { AdgerdirTag } from './adgerdirTag.model'

@ObjectType()
export class AdgerdirTags {
  @Field(() => [AdgerdirTag])
  items?: AdgerdirTag[]
}
