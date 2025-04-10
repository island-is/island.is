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
  rel?: Action

  @Field({ nullable: true })
  displayTitle?: string
}
