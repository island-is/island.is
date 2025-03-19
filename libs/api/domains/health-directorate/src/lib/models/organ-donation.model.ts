import { Field, InputType, ObjectType } from '@nestjs/graphql'

@ObjectType('HealthDirectorateOrganDonationOrgan')
export class Organ {
  @Field()
  id!: string

  @Field()
  name!: string
}
@ObjectType('HealthDirectorateOrganDonationLimitations')
export class Limitations {
  @Field(() => Boolean)
  hasLimitations!: boolean

  @Field(() => [Organ], {
    nullable: true,
    description: 'List of organs NOT to donate',
  })
  limitedOrgansList?: Organ[]

  @Field({
    nullable: true,
    description: 'Text to display if user does not want to donate all organs',
  })
  comment?: string
}

@ObjectType('HealthDirectorateOrganDonor')
export class Donor {
  @Field(() => Boolean)
  isDonor!: boolean

  @Field(() => Limitations, { nullable: true })
  limitations?: Limitations

  @Field(() => Boolean, { defaultValue: false })
  isMinor!: boolean

  @Field(() => Boolean, { defaultValue: false })
  isTemporaryResident!: boolean
}

@ObjectType('HealthDirectorateOrganDonation')
export class OrganDonation {
  @Field(() => Donor, { nullable: true })
  donor?: Donor | null

  @Field(() => [Organ], { nullable: true })
  organList?: Array<Organ>

  @Field(() => String, { nullable: true })
  locale?: 'is' | 'en'
}

@InputType('HealthDirectorateOrganDonorInput')
export class DonorInput {
  @Field(() => Boolean)
  isDonor!: boolean

  @Field(() => [String], { nullable: true })
  organLimitations?: string[]

  @Field({ nullable: true })
  comment?: string
}
