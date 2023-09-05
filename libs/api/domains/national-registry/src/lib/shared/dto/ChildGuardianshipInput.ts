import { Field, InputType } from '@nestjs/graphql'

@InputType('NationalRegistryChildGuardianshipInput')
export class ChildGuardianshipInput {
  @Field()
  childNationalId!: string
}
