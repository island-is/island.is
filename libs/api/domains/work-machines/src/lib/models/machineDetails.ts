import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class MachineDetails {
  @Field(() => String)
  id!: string

  @Field(() => String, { nullable: true })
  regNumber?: string | null

  @Field(() => String, { nullable: true })
  type?: string | null

  @Field(() => String, { nullable: true })
  subType?: string | null

  @Field(() => String, { nullable: true })
  status?: string | null

  @Field(() => String, { nullable: true })
  category?: string | null

  @Field(() => String, { nullable: true })
  ownerNumber?: string | null

  @Field(() => String, { nullable: true })
  plate?: string | null

  @Field(() => Boolean, { nullable: true })
  disabled?: boolean | null

  @Field(() => String, { nullable: true })
  supervisorName?: string | null

  @Field(() => Boolean, { nullable: true })
  paymentRequiredForOwnerChange?: boolean | null
}
