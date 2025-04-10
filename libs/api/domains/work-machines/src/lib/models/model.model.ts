import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('WorkMachinesModel')
export class Model {
  @Field()
  name!: string
}
