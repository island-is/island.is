import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class IndictmentCount {
  @Field(() => ID)
  readonly id!: string

  @Field()
  readonly created!: string

  @Field()
  readonly modified!: string

  @Field()
  readonly caseId!: string

  @Field({ nullable: true })
  readonly policeCaseNumber?: string
}
