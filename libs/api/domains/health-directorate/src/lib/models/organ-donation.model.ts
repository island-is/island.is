import { ObjectType, Field, InputType } from '@nestjs/graphql'

@ObjectType('HealthDirectorateOrganDonationLimitations')
export class Limitations {
  @Field(() => Boolean)
  hasLimitations!: boolean

  @Field(() => [String], {
    nullable: true,
    description: 'List of organs NOT to donate',
  })
  organList?: string[]

  @Field(() => [String], {
    nullable: true,
    description: 'List of organ IDs NOT to donate',
  })
  organIds?: string[]

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
}

@ObjectType('HealthDirectorateOrganDonationOrgan')
export class Organ {
  @Field({ nullable: true })
  id?: string

  @Field({ nullable: true })
  name?: string
}

@ObjectType('HealthDirectorateOrganDonation')
export class OrganDonation {
  @Field(() => Donor, { nullable: true })
  donor?: Donor

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
}
