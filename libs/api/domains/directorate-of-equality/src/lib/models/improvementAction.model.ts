import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('DirectorateOfEqualityImprovementAction')
export class ImprovementAction {
  @Field(() => ID, { description: 'Outlier group id' })
  id!: string

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  reason?: string

  @Field(() => String, { nullable: true })
  correctionPlan?: string

  @Field(() => Date, {
    nullable: true,
    description: 'Date the improvements are committed to be done by',
  })
  deadline?: Date

  @Field(() => String, { nullable: true })
  responsibleName?: string

  @Field(() => String, { nullable: true })
  responsibleTitle?: string
}
