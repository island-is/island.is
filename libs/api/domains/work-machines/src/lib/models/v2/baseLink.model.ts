import { Field, InterfaceType } from '@nestjs/graphql'

@InterfaceType('WorkMachinesBaseLink', { isAbstract: true })
export abstract class BaseLink {
  @Field()
  href!: string

  @Field()
  method!: string

  @Field({ nullable: true })
  displayTitle?: string
}
