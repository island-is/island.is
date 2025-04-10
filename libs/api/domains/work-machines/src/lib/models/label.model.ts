import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('WorkMachinesV2Label')
export class Label {
  @Field({ nullable: true })
  columnName?: string

  @Field({ nullable: true })
  displayTitle?: string

  @Field({ nullable: true })
  tooltip?: string
}
