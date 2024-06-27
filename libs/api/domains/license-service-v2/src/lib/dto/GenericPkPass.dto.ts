import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('LicenseServiceV2GenericPkPass')
export class GenericPkPass {
  @Field()
  pkpassUrl!: string
}
