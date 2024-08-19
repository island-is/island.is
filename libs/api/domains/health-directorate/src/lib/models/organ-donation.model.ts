import { ObjectType, Field, Int, InputType } from '@nestjs/graphql'

@ObjectType('HealthDirectorateOrganDonorStatus')
export class DonorStatus {
  @Field(() => Boolean)
  isDonor!: boolean

  @Field(() => [String], { nullable: true })
  exceptions?: string[]

  @Field({ nullable: true })
  exceptionComment?: string

  @Field(() => Date, { nullable: true })
  registrationDate?: Date
}

@InputType('HealthDirectorateOrganDonorStatusInput')
export class DonorStatusInput {
  @Field(() => Boolean)
  isDonor!: boolean

  @Field(() => [String], { nullable: true })
  exceptions?: string[]

  @Field({ nullable: true })
  exceptionComment?: string
}

@ObjectType('HealthDirectorateOrganDonationExceptionObject')
export class DonationExceptionObject {
  @Field({ nullable: true })
  id?: string

  @Field({ nullable: true })
  name?: string
}

@ObjectType('HealthDirectorateOrganDonationException')
export class DonationException {
  @Field(() => [DonationExceptionObject], { nullable: true })
  values?: DonationExceptionObject[]
}

@ObjectType('HealthDirectorateError')
export class HealthDirectorateError {
  @Field({ nullable: true })
  type?: string

  @Field({ nullable: true })
  title?: string

  @Field(() => Int, { nullable: true })
  status?: number

  @Field({ nullable: true })
  detail?: string

  @Field({ nullable: true })
  instance?: string
}
