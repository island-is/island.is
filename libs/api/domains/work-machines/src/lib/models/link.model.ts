import { ObjectType, Field, registerEnumType } from '@nestjs/graphql'
import { Action, LinkCategory, LinkType } from '../workMachines.types'

registerEnumType(Action, { name: 'WorkMachinesAction' })
registerEnumType(LinkType, { name: 'WorkMachinesLinkType' })
registerEnumType(LinkCategory, { name: 'WorkMachinesLinkCategory' })

@ObjectType('WorkMachinesLink')
export class Link {
  @Field()
  href!: string

  @Field(() => LinkType, { nullable: true })
  relation?: LinkType

  @Field(() => LinkCategory, { nullable: true })
  relationCategory?: LinkCategory

  @Field({ nullable: true })
  displayTitle?: string

  /** DEPRECATION LINE */

  @Field(() => Action, {
    deprecationReason: 'Unclear name, use relation instead',
    nullable: true,
  })
  rel?: Action
}
