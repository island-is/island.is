import { ObjectType, Field, registerEnumType } from '@nestjs/graphql'
import { ExternalLink } from '../../workMachines.types'
import { BaseLink } from './baseLink.model'

registerEnumType(ExternalLink, {
  name: 'WorkMachinesExternalLink',
})

@ObjectType('WorkMachinesCollectionLink', {
  implements: () => BaseLink,
})
export class CollectionLink implements BaseLink {
  @Field()
  href!: string

  @Field(() => ExternalLink)
  rel!: ExternalLink

  @Field()
  method!: string

  @Field({ nullable: true })
  displayTitle?: string
}
