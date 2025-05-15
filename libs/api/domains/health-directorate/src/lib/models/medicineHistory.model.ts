import { Field, ID, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('HealthDirectorateMedicineHistoryDispensation')
export class MedicineHistoryDispensation {
  @Field({ nullable: true })
  id?: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  agentName?: string

  @Field(() => Date, { nullable: true })
  date?: Date

  @Field({ nullable: true })
  strength?: string

  @Field({ nullable: true })
  quantity?: string

  @Field({ nullable: true })
  unit?: string

  @Field({ nullable: true })
  type?: string

  @Field({ nullable: true })
  indication?: string

  @Field({ nullable: true })
  dosageInstructions?: string

  @Field(() => Date, { nullable: true })
  issueDate?: Date

  @Field({ nullable: true })
  prescriberName?: string

  @Field(() => Date, { nullable: true })
  expirationDate?: Date

  @Field(() => Boolean, { nullable: true })
  isExpired?: boolean
}

@ObjectType('HealthDirectorateMedicineHistoryItem')
export class MedicineHistoryItem {
  @Field({ nullable: true })
  id?: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  strength?: string

  @Field({ nullable: true })
  atcCode?: string

  @Field({ nullable: true })
  indication?: string

  @Field(() => Date, { nullable: true })
  lastDispensationDate?: Date

  @Field(() => Int, { nullable: true })
  dispensationCount?: number

  @Field(() => [MedicineHistoryDispensation])
  dispensations!: MedicineHistoryDispensation[]
}

@ObjectType('HealthDirectorateMedicineHistory')
export class MedicineHistory {
  @Field(() => [MedicineHistoryItem])
  medicineHistory!: MedicineHistoryItem[]
}
