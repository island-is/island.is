import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('WorkMachinesLabel')
export class Label {
  @Field({ nullable: true })
  columnName?: string

  @Field({ nullable: true })
  displayTitle?: string

  @Field({ nullable: true })
  tooltip?: string
}
