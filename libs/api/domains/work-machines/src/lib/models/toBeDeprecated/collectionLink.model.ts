import { ObjectType, Field, Directive, registerEnumType } from '@nestjs/graphql'
import { ExternalLink } from '../../workMachines.types'

registerEnumType(ExternalLink, { name: 'WorkMachinesExternalLink' })

@Directive('@deprecated(reason: "Up for removal")')
@ObjectType('WorkMachinesCollectionLink')
export class CollectionLink {
  @Field({ nullable: true })
  href?: string

  @Field(() => ExternalLink, { nullable: true })
  rel?: ExternalLink

  @Field({ nullable: true, deprecationReason: 'Unnecessary information' })
  method?: string

  @Field({ nullable: true })
  displayTitle?: string
}
