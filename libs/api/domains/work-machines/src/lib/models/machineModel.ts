import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class MachineModel {
  @Field(() => String, { nullable: true })
  name?: string | null
}
