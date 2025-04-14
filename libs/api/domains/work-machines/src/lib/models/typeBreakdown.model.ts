import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('WorkMachinesTypeBreakdown')
export class TypeBreakdown {
  @Field()
  name!: string

  @Field({ nullable: true })
  subtypeName?: string

  @Field({ nullable: true })
  fullTypeName?: string
}
