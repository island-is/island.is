import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetChildGuardianshipInput {
  @Field()
  childNationalId!: string
}
