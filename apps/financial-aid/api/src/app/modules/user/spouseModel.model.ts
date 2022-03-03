import { Field, ObjectType } from '@nestjs/graphql'

import { Spouse } from '@island.is/financial-aid/shared/lib'

@ObjectType()
export class SpouseModel implements Spouse {
  @Field()
  readonly hasPartnerApplied!: boolean

  @Field()
  readonly hasFiles!: boolean

  @Field()
  readonly applicantName!: string

  @Field()
  readonly applicantSpouseEmail!: string
}
