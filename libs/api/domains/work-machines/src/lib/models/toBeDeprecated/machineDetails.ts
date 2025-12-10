import { ObjectType, Field, Directive } from '@nestjs/graphql'

@Directive('@deprecated(reason: "Up for removal")')
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

  //this should probaby be an application specific utility, since
  //it doesn't really describe the object itself. imo
  @Field(() => Boolean, { nullable: true })
  disabled?: boolean | null

  @Field(() => String, { nullable: true })
  supervisorName?: string | null

  @Field(() => Boolean, { nullable: true })
  paymentRequiredForOwnerChange?: boolean | null
}
