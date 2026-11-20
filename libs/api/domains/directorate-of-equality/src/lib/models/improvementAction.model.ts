import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('DirectorateOfEqualityImprovementAction')
export class ImprovementAction {
  @Field(() => ID, { description: 'Outlier group id' })
  id!: string

  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  reason?: string | null

  @Field(() => String, { nullable: true })
  correctionPlan?: string | null

  @Field(() => Date, {
    nullable: true,
    description: 'Date the improvements are committed to be done by',
  })
  deadline?: Date | null

  @Field(() => String, { nullable: true })
  responsibleName?: string | null

  @Field(() => String, { nullable: true })
  responsibleTitle?: string | null
}
