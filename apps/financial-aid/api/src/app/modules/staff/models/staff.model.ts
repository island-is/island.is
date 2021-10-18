import { Field, ObjectType, ID } from '@nestjs/graphql'

import { Staff, StaffRole } from '@island.is/financial-aid/shared/lib'

@ObjectType()
export class StaffModel implements Staff {
  @Field(() => ID)
  readonly id!: string

  @Field()
  readonly name!: string

  @Field()
  readonly nationalId!: string

  @Field()
  readonly municipalityId!: string

  @Field()
  readonly municipalityName!: string

  @Field(() => String)
  readonly role!: StaffRole

  @Field()
  readonly active!: boolean

  @Field({ nullable: true })
  readonly phoneNumber?: string
}
