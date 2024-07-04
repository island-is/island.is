import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ChildrenModel {
  @Field({ nullable: true })
  readonly school?: string

  @Field()
  readonly nationalId!: string

  @Field()
  readonly name!: string

  @Field()
  readonly livesWithApplicant!: boolean

  @Field()
  readonly livesWithBothParents!: boolean
}
