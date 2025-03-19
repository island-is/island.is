import { ObjectType, Field, registerEnumType } from '@nestjs/graphql'
import { BaseLink } from './baseLink.model'
import { Action } from '../../workMachines.types'

registerEnumType(Action, { name: 'WorkMachinesAction' })

@ObjectType('WorkMachinesCollectionLink', {
  implements: () => BaseLink,
})
export class Link implements BaseLink {
  @Field()
  href!: string

  @Field(() => Action, { nullable: true })
  rel?: Action

  @Field()
  method!: string

  @Field({ nullable: true })
  displayTitle?: string
}
