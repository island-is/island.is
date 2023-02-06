import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class OperatorChangeAnswersPickVehicle {
  @Field(() => String, { nullable: false })
  plate!: string
}

@InputType()
export class OperatorChangeAnswersUser {
  @Field(() => String, { nullable: false })
  nationalId!: string
}

@InputType()
export class OperatorChangeAnswersOperators {
  @Field(() => String, { nullable: false })
  nationalId!: string
}

@InputType()
export class OperatorChangeAnswersMainOperator {
  @Field(() => String, { nullable: false })
  nationalId!: string
}

@InputType()
export class OperatorChangeAnswers {
  @Field(() => OperatorChangeAnswersPickVehicle, { nullable: false })
  pickVehicle!: OperatorChangeAnswersPickVehicle

  @Field(() => OperatorChangeAnswersUser, { nullable: false })
  owner!: OperatorChangeAnswersUser

  @Field(() => [OperatorChangeAnswersOperators], { nullable: true })
  operators?: OperatorChangeAnswersOperators[]

  @Field(() => OperatorChangeAnswersMainOperator, { nullable: true })
  mainOperator?: OperatorChangeAnswersMainOperator
}
