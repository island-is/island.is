import { ObjectType, Field, registerEnumType } from '@nestjs/graphql'
import { BaseLink } from './baseLink.model'
import { ExternalLink } from '../workMachines.types'

registerEnumType(ExternalLink, {
  name: 'WorkMachinesExternalLink',
})

@ObjectType('WorkMachinesCollectionLink', {
  implements: () => BaseLink,
})
export class CollectionLink implements BaseLink {
  @Field()
  href!: string

  @Field(() => ExternalLink, { nullable: true })
  relation?: ExternalLink

  @Field()
  method!: string

  @Field({ nullable: true })
  displayTitle?: string

  /** DEPRECATION LINE */

  @Field(() => ExternalLink, {
    deprecationReason: 'Unclear name, use relation instead',
    nullable: true,
  })
  rel?: ExternalLink
}
