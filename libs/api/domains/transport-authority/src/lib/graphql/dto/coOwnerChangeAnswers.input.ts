import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CoOwnerChangeAnswersPickVehicle {
  @Field(() => String, { nullable: false })
  plate!: string
}

@InputType()
export class CoOwnerChangeAnswersUser {
  @Field(() => String, { nullable: false })
  nationalId!: string

  @Field(() => String, { nullable: false })
  email!: string
}

@InputType()
export class CoOwnerChangeAnswersBuyerOrCoOwner {
  @Field(() => String, { nullable: false })
  nationalId!: string

  @Field(() => String, { nullable: false })
  email!: string

  @Field(() => String, { nullable: false })
  type!: string
}

@InputType()
export class CoOwnerChangeAnswers {
  @Field(() => CoOwnerChangeAnswersPickVehicle, { nullable: false })
  pickVehicle!: CoOwnerChangeAnswersPickVehicle

  @Field(() => CoOwnerChangeAnswersUser, { nullable: false })
  owner!: CoOwnerChangeAnswersUser

  @Field(() => [CoOwnerChangeAnswersBuyerOrCoOwner], { nullable: true })
  buyerCoOwnerAndOperator?: CoOwnerChangeAnswersBuyerOrCoOwner[]
}
