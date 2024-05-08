import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType('MunicipalitiesFinancialAidApplicationChildren')
export class ApplicationChildrenModel {
  @Field(() => ID)
  readonly id!: string

  @Field()
  readonly applicationId!: string

  @Field({ nullable: true })
  readonly school?: string

  @Field()
  readonly nationalId!: string

  @Field()
  readonly name!: string
}
