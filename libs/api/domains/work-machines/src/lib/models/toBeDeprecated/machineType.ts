import { ObjectType, Field, Directive } from '@nestjs/graphql'

@Directive('@deprecated(reason: "Up for removal")')
@ObjectType('WorkMachinesMachineType')
export class MachineType {
  @Field(() => String, { nullable: true })
  name?: string | null
}
