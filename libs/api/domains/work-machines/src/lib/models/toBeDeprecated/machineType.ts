import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('WorkMachinesMachineType')
export class MachineType {
  @Field(() => String, { nullable: true })
  name?: string | null
}
