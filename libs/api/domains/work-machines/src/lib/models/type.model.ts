import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('WorkMachinesV2Type')
export class Type {
  @Field()
  type!: string

  @Field({ nullable: true })
  subtype?: string

  @Field({ nullable: true })
  fullType?: string
}
