import { Field, InputType } from '@nestjs/graphql'

@InputType('NationalRegistryXRoadChildGuardianshipInput')
export class GetChildGuardianshipInput {
  @Field()
  childNationalId!: string
}
