import { Field, GraphQLISODateTime, ID, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ShipRegistrySailorRegistrationExemption {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  shipRegistrationNumber?: string

  @Field()
  shipName!: string

  @Field({ nullable: true })
  rank?: string

  @Field({
    nullable: true,
    description:
      'Whether the dispensation position was publicly advertised before the exemption was granted.',
  })
  advertised?: string

  @Field({
    nullable: true,
    description:
      'Indicates whether the dispensation requires the holder to hold a certificate for the capacity immediately below the dispensed role, as required by the Icelandic Transport Authority.',
  })
  exemptionLowerCertificateStatus?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  dateFrom?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  dateTo?: Date

  @Field(() => Int, { nullable: true })
  numberOfDays?: number
}
