import { ObjectType, Field, registerEnumType } from '@nestjs/graphql'
import { BaseLink } from './baseLink.model'
import { Action } from '../workMachines.types'

registerEnumType(Action, { name: 'WorkMachinesAction' })

@ObjectType('WorkMachinesLink', {
  implements: () => BaseLink,
})
export class Link implements BaseLink {
  @Field()
  href!: string

  @Field(() => Action, { nullable: true })
  relation?: Action

  @Field({ nullable: true })
  displayTitle?: string

  /** DEPRECATION LINE */

  @Field(() => Action, {
    deprecationReason: 'Unclear name, use relation instead',
    nullable: true,
  })
  rel?: Action
}
