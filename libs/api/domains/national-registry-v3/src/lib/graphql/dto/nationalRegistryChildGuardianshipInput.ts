import { Field, InputType } from '@nestjs/graphql'

@InputType('NationalRegistryMIdlunChildGuardianshipInput')
export class ChildGuardianshipInput {
  @Field()
  childNationalId!: string
}
