import { Field, InputType } from '@nestjs/graphql'

// TODO: remove this comment
@InputType('NationalRegistryChildGuardianshipInput')
export class ChildGuardianshipInput {
  @Field()
  childNationalId!: string
}
