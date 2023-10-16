import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class OwnerChangeAnswersPickVehicle {
  @Field(() => String, { nullable: false })
  plate!: string
}

@InputType()
export class OwnerChangeAnswersVehicle {
  @Field(() => String, { nullable: true })
  salePrice?: string

  @Field(() => String, { nullable: false })
  date!: string

  @Field(() => String, { nullable: true })
  mileage?: string
}

@InputType()
export class OwnerChangeAnswersUser {
  @Field(() => String, { nullable: false })
  nationalId!: string

  @Field(() => String, { nullable: false })
  email!: string
}

@InputType()
export class OwnerChangeAnswersBuyerOrCoOwner {
  @Field(() => String, { nullable: false })
  nationalId!: string

  @Field(() => String, { nullable: false })
  email!: string

  @Field(() => String, { nullable: false })
  type!: string

  @Field(() => String, { nullable: true })
  wasRemoved?: string
}

@InputType()
export class OwnerChangeAnswersMainOperator {
  @Field(() => String, { nullable: false })
  nationalId!: string
}

@InputType()
export class OwnerChangeAnswersInsurance {
  @Field(() => String, { nullable: false })
  value!: string
}

@InputType()
export class OwnerChangeAnswers {
  @Field(() => OwnerChangeAnswersPickVehicle, { nullable: false })
  pickVehicle!: OwnerChangeAnswersPickVehicle

  @Field(() => OwnerChangeAnswersVehicle, { nullable: false })
  vehicle!: OwnerChangeAnswersVehicle

  @Field(() => OwnerChangeAnswersUser, { nullable: false })
  seller!: OwnerChangeAnswersUser

  @Field(() => OwnerChangeAnswersUser, { nullable: false })
  buyer!: OwnerChangeAnswersUser

  @Field(() => [OwnerChangeAnswersBuyerOrCoOwner], { nullable: true })
  buyerCoOwnerAndOperator?: OwnerChangeAnswersBuyerOrCoOwner[]

  @Field(() => OwnerChangeAnswersMainOperator, { nullable: true })
  buyerMainOperator?: OwnerChangeAnswersMainOperator

  @Field(() => OwnerChangeAnswersInsurance, { nullable: true })
  insurance?: OwnerChangeAnswersInsurance
}
