import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CoOwnerChangeAnswersPickVehicle {
  @Field(() => String, { nullable: false })
  plate!: string
}

@InputType()
export class CoOwnerChangeAnswersVehicle {
  @Field(() => String, { nullable: true })
  mileage?: string
}

@InputType()
export class CoOwnerChangeAnswersUser {
  @Field(() => String, { nullable: false })
  nationalId!: string

  @Field(() => String, { nullable: false })
  email!: string
}

@InputType()
export class CoOwnerChangeAnswersOwnerCoOwners {
  @Field(() => String, { nullable: false })
  nationalId!: string

  @Field(() => String, { nullable: false })
  email!: string

  @Field(() => String, { nullable: true })
  wasRemoved?: string
}

@InputType()
export class CoOwnerChangeAnswersCoOwners {
  @Field(() => String, { nullable: false })
  nationalId!: string

  @Field(() => String, { nullable: false })
  email!: string

  @Field(() => String, { nullable: true })
  wasRemoved?: string
}

@InputType()
export class CoOwnerChangeAnswers {
  @Field(() => CoOwnerChangeAnswersPickVehicle, { nullable: false })
  pickVehicle!: CoOwnerChangeAnswersPickVehicle

  @Field(() => CoOwnerChangeAnswersVehicle, { nullable: false })
  vehicle!: CoOwnerChangeAnswersVehicle

  @Field(() => CoOwnerChangeAnswersUser, { nullable: false })
  owner!: CoOwnerChangeAnswersUser

  @Field(() => [CoOwnerChangeAnswersOwnerCoOwners], { nullable: true })
  ownerCoOwners?: CoOwnerChangeAnswersOwnerCoOwners[]

  @Field(() => [CoOwnerChangeAnswersCoOwners], { nullable: true })
  coOwners?: CoOwnerChangeAnswersCoOwners[]
}
