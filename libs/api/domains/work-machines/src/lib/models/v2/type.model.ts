import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('WorkMachinesType')
export class Type {
  @Field()
  type!: string

  @Field({ nullable: true })
  subtype?: string

  @Field({ nullable: true })
  fullType?: string
}
