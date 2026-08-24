import { Field, Float, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('DirectorateOfEqualityDraftEmployee')
export class DraftEmployeeModel {
  @Field(() => String)
  id!: string

  @Field(() => Int)
  ordinal!: number

  @Field(() => String, { nullable: true })
  field?: string | null

  @Field(() => String, { nullable: true })
  department?: string | null

  @Field(() => String)
  startDate!: string

  @Field(() => Float)
  workRatio!: number

  @Field(() => Float)
  baseSalary!: number

  @Field(() => Float, { nullable: true })
  additionalFixedOvertime?: number | null

  @Field(() => Float, { nullable: true })
  additionalFixedCarAllowance?: number | null

  @Field(() => Float, { nullable: true })
  bonusOccasionalCarAllowance?: number | null

  @Field(() => Float, { nullable: true })
  bonusOccasionalOvertime?: number | null

  @Field(() => Float, { nullable: true })
  bonusPayments?: number | null

  @Field(() => Float, { nullable: true })
  bonusOther?: number | null

  @Field(() => Float)
  additionalSalary!: number

  @Field(() => Float)
  bonusSalary!: number

  @Field(() => String)
  gender!: string

  @Field(() => String)
  reportEmployeeRoleId!: string

  @Field(() => String)
  reportId!: string

  @Field(() => Float, { nullable: true })
  score?: number | null
}

@ObjectType('DirectorateOfEqualityDraftEmployeeWithSteps')
export class DraftEmployeeWithStepsModel extends DraftEmployeeModel {
  @Field(() => String)
  roleTitle!: string

  @Field(() => [String])
  stepIds!: string[]
}
