import { Field, InterfaceType } from '@nestjs/graphql'

@InterfaceType('WorkMachinesV2BaseLink', { isAbstract: true })
export abstract class BaseLink {
  @Field()
  href!: string

  @Field({ nullable: true })
  displayTitle?: string
}
