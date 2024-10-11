import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('WorkMachinesModel')
export class Model {
  @Field(() => String, { nullable: true })
  name?: string | null
}
