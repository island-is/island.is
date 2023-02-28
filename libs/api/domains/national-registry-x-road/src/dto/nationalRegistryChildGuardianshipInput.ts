import { Field, InputType } from '@nestjs/graphql'

@InputType('NationalRegistryXRoadChildGuardianshipInput')
export class ChildGuardianshipInput {
  @Field()
  childNationalId!: string
}
